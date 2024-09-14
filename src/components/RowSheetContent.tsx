import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Radar from "./Radar";
import useSWR from "swr";

import {createClient} from "@/utils/supabase/client";
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

export function RowSheetContent({row}: RowSheetContentProps) {
  const passStartDateTime = formatDate(row.original.pass_start_time);
  const passEndDateTime = formatDate(row.original.pass_end_time);
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

  return (
    <SheetContent className="w-[400px] sm:w-2/3 sm:max-w-screen-lg">
      <SheetHeader>
        <SheetTitle>{`${satelliteName} ${passStartDateTime}`}</SheetTitle>
        <SheetDescription>
          <div className="flex items-center justify-start">
            <div className="space-y-2">
              <div>
                <strong>Pass Start Time:</strong> {passStartDateTime}
              </div>
              <div>
                <strong>Pass End Time:</strong> {passEndDateTime}
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
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
}
