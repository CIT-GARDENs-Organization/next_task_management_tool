import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import useSWR from "swr";
import {createClient} from "@/utils/supabase/client";
import {LatLngExpression} from "leaflet";
import OrbitMap from "./OrbitMap";
import SatelliteDetails from "@/components/SatelliteDetails";
import {calculateOrbitSegments} from "@/lib/calculateOrbitForMap";
import OperationSettings from "@/components/OperationSettings";

const supabase = createClient();

interface RowSheetContentProps {
  row: any;
}

const fetcher = async (url: string) => {
  console.log(url);
  const {data, error} = await supabase.from("tle").select("*").eq("id", url);
  if (error) {
    throw new Error(error.message);
  }
  return data;
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
  const tleUpdatedAt = new Date(row.original.tle_updated_at).toLocaleString();

  const tleId = row.original.tle_id;
  const {data} = useSWR(tleId, fetcher);

  let orbitSegments: LatLngExpression[][] = [];
  let extendedOrbitSegments: LatLngExpression[][] = [];
  if (data && data.length > 0) {
    const tleString = data[0].content;
    if (tleString) {
      orbitSegments = calculateOrbitSegments(
        tleString,
        passStartDateTime,
        passEndDateTime
      );
      const extendedEndTime = new Date(passEndDateTime.getTime() + 90 * 60000);
      extendedOrbitSegments = calculateOrbitSegments(
        tleString,
        passEndDateTime,
        extendedEndTime
      );
    }
  }

  const handleStatusChange = (status: string) => {
    console.log("Status changed to:", status);
  };

  return (
    <SheetContent className="w-[400px] sm:w-2/3 sm:max-w-screen-lg">
      <SheetHeader>
        <SheetTitle>{`${satelliteName} ${passStartDateTime.toLocaleString()}`}</SheetTitle>
        <SheetDescription>
          <SatelliteDetails
            satelliteName={satelliteName}
            passStartDateTime={passStartDateTime}
            passEndDateTime={passEndDateTime}
            maxElevation={maxElevation}
            azimuthStart={azimuthStart}
            azimuthEnd={azimuthEnd}
            countryList={countryList}
            updatesCount={updatesCount}
            tleUpdatedAt={tleUpdatedAt}
          />
          <div className="mt-8">
            {(orbitSegments.length > 0 || extendedOrbitSegments.length > 0) && (
              <OrbitMap
                orbitSegments={orbitSegments}
                extendedOrbitSegments={extendedOrbitSegments}
              />
            )}
          </div>
          <OperationSettings
            satelliteScheduleId={row.original.id}
            onStatusChange={handleStatusChange}
          />
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
}
