import * as satellite from "satellite.js";
import {LatLngExpression} from "leaflet";

export const calculateOrbitSegments = (
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

      if (longitude > 180) {
        longitude -= 360;
      }

      if (currentSegment.length > 0) {
        const prevLongitude = currentSegment[currentSegment.length - 1][1];
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
