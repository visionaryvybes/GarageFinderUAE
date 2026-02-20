interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Sparkline({
  data,
  width = 80,
  height = 28,
  color = "#8b5cf6",
  strokeWidth = 1.5,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");
  const lastParts = points[points.length - 1].split(",");
  const lastX = lastParts[0];
  const lastY = lastParts[1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={polyline}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
      {/* Fill area */}
      <polygon
        points={`0,${height} ${polyline} ${lastX},${height}`}
        fill={color}
        opacity={0.08}
      />
      {/* End dot */}
      <circle cx={lastX} cy={lastY} r={2} fill={color} opacity={0.9} />
    </svg>
  );
}
