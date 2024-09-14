import React from "react";

interface RadarProps {
  azimuthStart: number;
  azimuthEnd: number;
  maxElevation: number;
  size?: number;
}

const Radar: React.FC<RadarProps> = ({
  azimuthStart,
  azimuthEnd,
  maxElevation,
  size = 200,
}) => {
  const startAngle = ((450 - azimuthStart) % 360) * (Math.PI / 180);
  const endAngle = ((450 - azimuthEnd) % 360) * (Math.PI / 180);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY - radius * Math.sin(startAngle);
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY - radius * Math.sin(endAngle);

  const elevationRadius = ((90 - maxElevation) / 90) * radius;
  const controlAngle = (startAngle + endAngle) / 2;
  const controlX = centerX + elevationRadius * Math.cos(controlAngle);
  const controlY = centerY - elevationRadius * Math.sin(controlAngle);

  const controlPointX = 2 * controlX - (startX + endX) / 2;
  const controlPointY = 2 * controlY - (startY + endY) / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{overflow: "visible"}}
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="gray"
        strokeWidth="2"
        fill="none"
      />

      <circle
        cx={centerX}
        cy={centerY}
        r={radius * (2 / 3)} // 30 degrees
        stroke="lightgray"
        strokeWidth="1"
        fill="none"
        strokeDasharray="4"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * (1 / 3)} // 60 degrees
        stroke="lightgray"
        strokeWidth="1"
        fill="none"
        strokeDasharray="4"
      />

      <line
        x1={centerX}
        y1={centerY}
        x2={startX}
        y2={startY}
        stroke="green"
        strokeWidth="2"
      />

      <line
        x1={centerX}
        y1={centerY}
        x2={endX}
        y2={endY}
        stroke="red"
        strokeWidth="2"
      />

      <path
        d={`M ${startX} ${startY} Q ${controlPointX} ${controlPointY} ${endX} ${endY}`}
        stroke="blue"
        strokeWidth="2"
        fill="none"
      />

      <circle cx={controlX} cy={controlY} r="4" fill="blue" />
      <text
        x={controlX}
        y={controlY - 8}
        textAnchor="middle"
        fontSize="10"
        fill="blue"
      >
        {maxElevation.toFixed(1)}°
      </text>

      <text
        x={centerX}
        y={centerY - radius - 10}
        textAnchor="middle"
        fontSize="12"
        fill="black"
      >
        N
      </text>
      <text
        x={centerX}
        y={centerY + radius + 15}
        textAnchor="middle"
        fontSize="12"
        fill="black"
      >
        S
      </text>
      <text
        x={centerX + radius + 15}
        y={centerY + 5}
        textAnchor="middle"
        fontSize="12"
        fill="black"
      >
        E
      </text>
      <text
        x={centerX - radius - 15}
        y={centerY + 5}
        textAnchor="middle"
        fontSize="12"
        fill="black"
      >
        W
      </text>
    </svg>
  );
};

export default Radar;
