import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type ParsedTLE = {
  line1: {
    lineNumber: number; // 1 要素データ行番号
    satelliteCatalogNumber: string; // B 衛星カタログ番号
    classification: "S" | "U"; // C 軍事機密種別
    launchYear: string; // DD 国際衛星識別符号
    launchNumber: string; // EEE 国際衛星識別符号
    launchPiece: string; // FFF 国際衛星識別符号
    epochYear: string; // GG 元期(西暦の下2桁)
    epochDay: string; // HHH.HHHHHHHH 元期（年通算日.その日の00時からの経過時間)
    meanMotionFirstDerivative: string; // +IIIIIIII (平均運動の1次の時間微分)
    meanMotionSecondDerivative: string; // +JJJJJ-J (平均運動の2次の時間微分)
    bStarDragTerm: string; // +KKKKK-K 大気抵抗係数項
    ephemerisType: number; // L 軌道モデルの種別
    elementSetNumber: string; // MMMM 軌道要素通番
    checksum: number; // N チェックサム
  };
  line2: {
    lineNumber: number; // 2 要素データ行番号
    satelliteCatalogNumber: string; // B 衛星カタログ番号
    inclination: number; // PPP.PPPP 軌道傾斜角[度]
    rightAscension: number; // QQQ.QQQQ 昇交点の赤経[度]
    eccentricity: number; // RRRRRRR 離心率
    perigeeArgument: number; // SSS.SSSS 近地点引数[度]
    meanAnomaly: number; // TTT.TTTT 平均近点角[度]
    meanMotion: number; // UU.UUUUUUUU 平均運動[回転/day]
    revolutionNumber: string; // VVVVV 通算周回数
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

  return {
    line1: {
      lineNumber: parseInt(line1.slice(0, 1)), // Line 1
      satelliteCatalogNumber: line1.slice(2, 7).trim(), // BBBBB
      classification: line1[7] as "S" | "U", // C
      launchYear: line1.slice(9, 11).trim(), // DD
      launchNumber: line1.slice(11, 14).trim(), // EEE
      launchPiece: line1.slice(14, 17).trim(), // FFF
      epochYear: line1.slice(18, 20).trim(), // GG
      epochDay: line1.slice(20, 32).trim(), // HHH.HHHHHHHH
      meanMotionFirstDerivative: line1.slice(33, 43).trim(), // +IIIIIIII
      meanMotionSecondDerivative: line1.slice(44, 52).trim(), // +JJJJJ-J
      bStarDragTerm: line1.slice(53, 61).trim(), // +KKKKK-K
      ephemerisType: parseInt(line1.slice(62, 63)), // L
      elementSetNumber: line1.slice(64, 68).trim(), // MMMM
      checksum: parseInt(line1.slice(68, 69)), // N
    },
    line2: {
      lineNumber: parseInt(line2.slice(0, 1)), // Line 2
      satelliteCatalogNumber: line2.slice(2, 7).trim(), // BBBBB
      inclination: parseFloat(line2.slice(8, 16).trim()), // PPP.PPPP
      rightAscension: parseFloat(line2.slice(17, 25).trim()), // QQQ.QQQQ
      eccentricity: parseFloat(`0.${line2.slice(26, 33).trim()}`), // RRRRRRR
      perigeeArgument: parseFloat(line2.slice(34, 42).trim()), // SSS.SSSS
      meanAnomaly: parseFloat(line2.slice(43, 51).trim()), // TTT.TTTT
      meanMotion: parseFloat(line2.slice(52, 63).trim()), // UU.UUUUUUUU
      revolutionNumber: line2.slice(63, 68).trim(), // VVVVV
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
  console.log("Name:", record.name);
  console.log("Content:", record.content);
  console.log("NORAD ID:", record.norad_id);
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
        // TLEをパースして出力
        const tleInfo = parseTLE(tle);
        console.log("Line 1 Parsed:");
        console.log(tleInfo.line1);
        console.log("Line 2 Parsed:");
        console.log(tleInfo.line2);
      } catch (error) {
        console.error(`Error parsing TLE: ${error.message}`);
        return new Response(`Error: ${error.message}`, {status: 400});
      }
    } else {
      console.error("TLE data is not in expected format.");
      return new Response("TLE data is not in expected format.", {status: 400});
    }
  } else {
    console.error("TLE content is undefined or missing.");
    return new Response("TLE content is undefined or missing.", {status: 400});
  }

  return new Response("OK");
});
