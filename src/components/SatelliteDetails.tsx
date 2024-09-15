import Radar from "./Radar";

interface SatelliteDetailsProps {
  satelliteName: string;
  passStartDateTime: Date;
  passEndDateTime: Date;
  maxElevation: number;
  azimuthStart: number;
  azimuthEnd: number;
  countryList: string;
  updatesCount: number;
  tleUpdatedAt: string;
}

const SatelliteDetails = ({
  satelliteName,
  passStartDateTime,
  passEndDateTime,
  maxElevation,
  azimuthStart,
  azimuthEnd,
  countryList,
  updatesCount,
  tleUpdatedAt,
}: SatelliteDetailsProps) => {
  return (
    <div className="flex items-center justify-start">
      <div className="space-y-2">
        <div>
          <strong>Pass Start Time:</strong> {passStartDateTime.toLocaleString()}
        </div>
        <div>
          <strong>Pass End Time:</strong> {passEndDateTime.toLocaleString()}
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
  );
};

export default SatelliteDetails;
