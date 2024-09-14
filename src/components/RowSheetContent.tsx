import dynamic from "next/dynamic";
import {useEffect} from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Radar from "./Radar";
import useSWR from "swr";
import {createClient} from "@/utils/supabase/client";
import * as satellite from "satellite.js";
import {LatLngExpression} from "leaflet";

// Dynamically import MapContainer to prevent SSR
const DynamicMapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {ssr: false}
);
const DynamicTileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {ssr: false}
);
const DynamicPolyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  {ssr: false}
);

const supabase = createClient();

interface RowSheetContentProps {
  row: any;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetcher = async (url: string) => {
  console.log(url);
  const {data, error} = await supabase.from("tle").select("*").eq("id", url);
  console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const calculateOrbitSegments = (
  tleString: string,
  startTime: Date,
  endTime: Date
) => {
  const tleLines = tleString.split("\n");
  const satrec = satellite.twoline2satrec(tleLines[1], tleLines[2]);

  let segments: LatLngExpression[][] = [];
  let currentSegment: [number, number][] = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    const gmst = satellite.gstime(currentTime);
    const positionAndVelocity = satellite.propagate(satrec, currentTime);
    const positionEci = positionAndVelocity.position;
    let positionGd;
    if (positionEci) {
      positionGd = satellite.eciToGeodetic(
        positionEci as satellite.EciVec3<number>,
        gmst
      );
    }

    if (positionGd) {
      let latitude = satellite.degreesLat(positionGd.latitude);
      let longitude = satellite.degreesLong(positionGd.longitude);

      if (longitude < -90) {
        longitude += 360;
      } else if (longitude > 270) {
        longitude -= 360;
      }
      if (currentSegment.length > 0) {
        const prevLongitude = currentSegment[currentSegment.length - 1][0];
        if (Math.abs(longitude - prevLongitude) > 180) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }

      currentSegment.push([latitude, longitude]);
    }

    currentTime = new Date(currentTime.getTime() + 60000);
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
};

export function RowSheetContent({row}: RowSheetContentProps) {
  const passStartDateTime = new Date(row.original.pass_start_time);
  const passEndDateTime = new Date(row.original.pass_end_time);
  const satelliteName = row.original.name;
  const maxElevation = row.original.max_elevation;
  const azimuthStart = row.original.azimuth_start;
  const azimuthEnd = row.original.azimuth_end;
  const countryList = row.original.country.join(", ");
  const updatesCount = row.original.updates_count;
  const tleUpdatedAt = formatDate(row.original.tle_updated_at);

  // tle_idを使用してtleテーブルから該当のtleデータを取得する
  const tleId = row.original.tle_id;
  const {data, error} = useSWR(tleId, fetcher);

  // Calculate orbit if TLE data is available
  let orbitSegments: LatLngExpression[][] = [];
  let extendedOrbitSegments: LatLngExpression[][] = [];
  if (data && data.length > 0) {
    const tleString = data[0].content;
    if (tleString) {
      // 1周分の軌道を描画
      orbitSegments = calculateOrbitSegments(
        tleString,
        passStartDateTime,
        passEndDateTime
      );
      // 追加で90分の軌道を描画
      const extendedEndTime = new Date(passEndDateTime.getTime() + 90 * 60000);
      extendedOrbitSegments = calculateOrbitSegments(
        tleString,
        passEndDateTime,
        extendedEndTime
      );
    }
  }

  return (
    <SheetContent className="w-[400px] sm:w-2/3 sm:max-w-screen-lg">
      <SheetHeader>
        <SheetTitle>{`${satelliteName} ${formatDate(
          row.original.pass_start_time
        )}`}</SheetTitle>
        <SheetDescription>
          <div className="flex items-center justify-start">
            <div className="space-y-2">
              <div>
                <strong>Pass Start Time:</strong>{" "}
                {formatDate(row.original.pass_start_time)}
              </div>
              <div>
                <strong>Pass End Time:</strong>{" "}
                {formatDate(row.original.pass_end_time)}
              </div>
              <div>
                <strong>Max Elevation:</strong> {maxElevation.toFixed(2)}°
              </div>
              <div>
                <strong>Azimuth Start:</strong> {azimuthStart.toFixed(2)}°
              </div>
              <div>
                <strong>Azimuth End:</strong> {azimuthEnd.toFixed(2)}°
              </div>
              <div>
                <strong>Countries:</strong> {countryList}
              </div>
              <div>
                <strong>Updates Count:</strong> {updatesCount}
              </div>
              <div>
                <strong>TLE Updated At:</strong> {tleUpdatedAt}
              </div>
            </div>
            <div className="ml-10">
              <Radar
                azimuthStart={azimuthStart}
                azimuthEnd={azimuthEnd}
                maxElevation={maxElevation}
                size={230}
              />
            </div>
          </div>
          <div className="mt-8">
            {(orbitSegments.length > 0 || extendedOrbitSegments.length > 0) && (
              <DynamicMapContainer
                center={[35, 135]} // Center the map around Japan
                zoom={3}
                style={{height: 300, width: "100%"}}
              >
                <DynamicTileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* 1周分の軌道を描画 */}
                {orbitSegments.map((segment, index) => (
                  <DynamicPolyline
                    key={`orbit-${index}`}
                    positions={segment}
                    color="red"
                  />
                ))}
                {/* 終了後の90分の軌道を描画 */}
                {extendedOrbitSegments.map((segment, index) => (
                  <DynamicPolyline
                    key={`extended-orbit-${index}`}
                    positions={segment}
                    color="blue"
                  />
                ))}
              </DynamicMapContainer>
            )}
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
}
