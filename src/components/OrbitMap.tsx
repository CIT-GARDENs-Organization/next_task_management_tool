import dynamic from "next/dynamic";
import {LatLngExpression} from "leaflet";

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

interface OrbitMapProps {
  orbitSegments: LatLngExpression[][];
  extendedOrbitSegments: LatLngExpression[][];
}

const OrbitMap = ({orbitSegments, extendedOrbitSegments}: OrbitMapProps) => {
  return (
    <DynamicMapContainer
      center={[0, 0]}
      zoom={1}
      style={{height: 300, width: "100%"}}
    >
      <DynamicTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {orbitSegments.map((segment, index) => (
        <DynamicPolyline
          key={`orbit-${index}`}
          positions={segment}
          color="red"
        />
      ))}
      {extendedOrbitSegments.map((segment, index) => (
        <DynamicPolyline
          key={`extended-orbit-${index}`}
          positions={segment}
          color="blue"
        />
      ))}
    </DynamicMapContainer>
  );
};

export default OrbitMap;
