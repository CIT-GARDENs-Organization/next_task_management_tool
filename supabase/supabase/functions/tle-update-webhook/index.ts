import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "jsr:@supabase/supabase-js@2";

type ParsedTLE = {
  line1: {
    lineNumber: number; // 1 要素データ行番号
    satelliteCatalogNumber: number; // B 衛星カタログ番号
    classification: "S" | "U"; // C 軍事機密種別
    launchYear: number; // DD 国際衛星識別符号
    launchNumber: number; // EEE 国際衛星識別符号
    launchPiece: string; // FFF 国際衛星識別符号
    epochYear: number; // GG 元期(西暦の下2桁)
    epochDay: number; // HHH.HHHHHHHH 元期（年通算日.その日の00時からの経過時間)
    meanMotionFirstDerivative: number; // +IIIIIIII (平均運動の1次の時間微分)
    meanMotionSecondDerivative: number; // +JJJJJ-J (平均運動の2次の時間微分)
    bStarDragTerm: number; // +KKKKK-K 大気抵抗係数項
    ephemerisType: number; // L 軌道モデルの種別
    elementSetNumber: number; // MMMM 軌道要素通番
    checksum: number; // N チェックサム
  };
  line2: {
    lineNumber: number; // 2 要素データ行番号
    satelliteCatalogNumber: number; // B 衛星カタログ番号
    inclination: number; // PPP.PPPP 軌道傾斜角[度]
    rightAscension: number; // QQQ.QQQQ 昇交点の赤経[度]
    eccentricity: number; // RRRRRRR 離心率
    perigeeArgument: number; // SSS.SSSS 近地点引数[度]
    meanAnomaly: number; // TTT.TTTT 平均近点角[度]
    meanMotion: number; // UU.UUUUUUUU 平均運動[回転/day]
    revolutionNumber: number; // VVVVV 通算周回数
    checksum: number; // W チェックサム
  };
};

// チェックサムを計算する関数
function calculateChecksum(line: string): number {
  let checksum = 0;
  for (let i = 0; i < 68; i++) {
    const char = line[i];
    if (char >= "0" && char <= "9") {
      checksum += parseInt(char);
    } else if (char === "-") {
      checksum += 1; // '-'は1としてカウント
    }
    // '+'や他の文字は無視する
  }
  return checksum % 10; // 最後に10で割った余り
}

function parseTLE(tle: {line1: string; line2: string}): ParsedTLE {
  const line1 = tle.line1;
  const line2 = tle.line2;

  const line1Checksum = calculateChecksum(line1);
  const line2Checksum = calculateChecksum(line2);

  // チェックサムを検証
  if (line1Checksum !== parseInt(line1.slice(68))) {
    throw new Error(
      `Line 1 checksum mismatch. Expected: ${line1.slice(
        68
      )}, Calculated: ${line1Checksum}`
    );
  }

  if (line2Checksum !== parseInt(line2.slice(68))) {
    throw new Error(
      `Line 2 checksum mismatch. Expected: ${line2.slice(
        68
      )}, Calculated: ${line2Checksum}`
    );
  }

  // for B* drag term
  const valueString = line1.slice(53, 61).trim();
  const sign = valueString[5] === "-" ? -1 : 1;
  const mantissa = parseFloat(`0.${valueString.slice(0, 5)}`);
  const exponent = parseInt(valueString.slice(6), 10);

  return {
    line1: {
      lineNumber: parseInt(line1.slice(0, 1)), // Line 1
      satelliteCatalogNumber: parseInt(line1.slice(2, 7).trim()), // BBBBB
      classification: line1[7] as "S" | "U", // C
      launchYear: parseInt(line1.slice(9, 11).trim()), // DD
      launchNumber: parseInt(line1.slice(11, 14).trim()), // EEE
      launchPiece: line1.slice(14, 17).trim(), // FFF
      epochYear: parseInt(line1.slice(18, 20).trim()), // GG
      epochDay: parseFloat(line1.slice(20, 32).trim()), // HHH.HHHHHHHH
      meanMotionFirstDerivative: parseFloat(line1.slice(33, 43).trim()), // +IIIIIIII
      meanMotionSecondDerivative: parseFloat(line1.slice(44, 52).trim()), // +JJJJJ-J
      bStarDragTerm: mantissa * Math.pow(10, sign * exponent), // +KKKKK-K
      ephemerisType: parseInt(line1.slice(62, 63)), // L
      elementSetNumber: parseInt(line1.slice(64, 68).trim()), // MMMM
      checksum: parseInt(line1.slice(68, 69)), // N
    },
    line2: {
      lineNumber: parseInt(line2.slice(0, 1)), // Line 2
      satelliteCatalogNumber: parseInt(line2.slice(2, 7).trim()), // BBBBB
      inclination: parseFloat(line2.slice(8, 16).trim()), // PPP.PPPP
      rightAscension: parseFloat(line2.slice(17, 25).trim()), // QQQ.QQQQ
      eccentricity: parseFloat(`0.${line2.slice(26, 33).trim()}`), // RRRRRRR
      perigeeArgument: parseFloat(line2.slice(34, 42).trim()), // SSS.SSSS
      meanAnomaly: parseFloat(line2.slice(43, 51).trim()), // TTT.TTTT
      meanMotion: parseFloat(line2.slice(52, 63).trim()), // UU.UUUUUUUU
      revolutionNumber: parseInt(line2.slice(63, 68).trim()), // VVVVV
      checksum: parseInt(line2.slice(68, 69)), // W
    },
  };
}

console.log("Hello from `tle-update-webhook` Functions!");

Deno.serve(async (req) => {
  const payload = await req.json();
  console.log(JSON.stringify(payload, null, 2));

  const record = payload.record;

  // 各要素をconsoleに出力
  console.log("ID:", record.id);
  console.log("Content:", record.content);
  console.log("Created At:", record.created_at);
  console.log("Satellite ID:", record.satellite_id);

  // TLEデータが存在するかを確認し、安全にアクセスする
  if (record && record.content) {
    const tleLines = record.content.trim().split("\n");
    if (tleLines.length === 3) {
      const tle = {
        line1: tleLines[1].trim(),
        line2: tleLines[2].trim(),
      };

      try {
        // Supabaseクライアントを作成
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          {
            global: {
              headers: {Authorization: req.headers.get("Authorization")!},
            },
          }
        );

        const tleInfo = parseTLE(tle);

        console.log("Parsed TLE:", tleInfo);

        const {error} = await supabase.from("parsed_tle").insert([
          {
            id: record.id,
            satellite_id: record.satellite_id,
            classification: tleInfo.line1.classification,
            launch_year: tleInfo.line1.launchYear,
            launch_number: tleInfo.line1.launchNumber,
            launch_piece: tleInfo.line1.launchPiece,
            epoch_year: tleInfo.line1.epochYear,
            epoch_day: tleInfo.line1.epochDay,
            mean_motion_first_derivative:
              tleInfo.line1.meanMotionFirstDerivative,
            mean_motion_second_derivative:
              tleInfo.line1.meanMotionSecondDerivative,
            b_star_drag_term: tleInfo.line1.bStarDragTerm,
            ephemeris_type: tleInfo.line1.ephemerisType,
            element_set_number: tleInfo.line1.elementSetNumber,
            inclination: tleInfo.line2.inclination,
            right_ascension: tleInfo.line2.rightAscension,
            eccentricity: tleInfo.line2.eccentricity,
            perigee_argument: tleInfo.line2.perigeeArgument,
            mean_anomaly: tleInfo.line2.meanAnomaly,
            mean_motion: tleInfo.line2.meanMotion,
            revolution_number: tleInfo.line2.revolutionNumber,
          },
        ]);

        if (error) {
          console.error(`Error inserting parsed TLE: ${error.message}`);
          return new Response(JSON.stringify({error: error.message}), {
            status: 400,
          });
        }

        return new Response("TLE data parsed and saved successfully", {
          status: 200,
        });
      } catch (error) {
        console.error(`Error parsing TLE: ${error.message}`);
        return new Response(`Error parsing TLE: ${error.message}`, {
          status: 400,
        });
      }
    } else {
      return new Response("TLE data is not in expected format.", {status: 400});
    }
  } else {
    return new Response("TLE content is undefined or missing.", {status: 400});
  }
});
