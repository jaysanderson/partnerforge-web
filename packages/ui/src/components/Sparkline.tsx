/**
 * Sparkline — tiny inline SVG line chart, no deps.
 *
 * Used on dashboard KPI tiles to show "the shape of the last N periods"
 * without committing the screen real-estate a full chart would demand.
 *
 * Hand-rolled rather than reaching for recharts/visx because:
 *   - 30 lines vs +200 kB gzipped
 *   - One pattern (a path) — no axes, no tooltips, no legend
 *   - Inherits text colour (`currentColor`) so it themes automatically
 *
 * Zero state: when data is empty / all-zero, renders a thin baseline so
 * the tile doesn't collapse vertically and the row stays aligned.
 */
import type { ReactElement } from 'react';

interface SparklineProps {
  /** Series in chronological order — left to right. */
  data: number[];
  /** Pixel height. Default 28. */
  height?: number;
  /** Pixel width. Default 80. Most tiles like 80–120. */
  width?: number;
  /** Stroke colour. Defaults to the parent text colour via currentColor. */
  stroke?: string;
  /** Fill the area under the line at low opacity. Default true. */
  filled?: boolean;
  /** aria-label for screen readers. Defaults to "Trend over time." */
  label?: string;
}

export function Sparkline({
  data,
  height = 28,
  width = 80,
  stroke = 'currentColor',
  filled = true,
  label = 'Trend over time',
}: SparklineProps): ReactElement {
  if (data.length < 2) {
    // Render a flat baseline so the tile keeps its height even with no data.
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-label={label}
        role="img"
      >
        <line
          x1={0}
          y1={height - 1}
          x2={width}
          y2={height - 1}
          stroke={stroke}
          strokeWidth={1}
          strokeOpacity={0.25}
        />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid divide-by-zero for flat series
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((v, i) => {
    const x = i * stepX;
    // Pad 2 px top/bottom so the line never touches the box edge.
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return [x, y] as const;
  });

  // Build a smoothed path using cubic Bezier control points between each
  // pair of points. Looks much less "jagged" than straight-line segments
  // without needing a real interpolation lib.
  let path = `M ${points[0]![0].toFixed(2)} ${points[0]![1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i]!;
    const [x1, y1] = points[i + 1]!;
    // Use a horizontal control vector — gives a gentle s-curve.
    const cx1 = x0 + (x1 - x0) / 2;
    const cy1 = y0;
    const cx2 = x0 + (x1 - x0) / 2;
    const cy2 = y1;
    path += ` C ${cx1.toFixed(2)} ${cy1.toFixed(2)}, ${cx2.toFixed(2)} ${cy2.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  // Close back along the baseline for the filled area.
  const area = `${path} L ${width.toFixed(2)} ${height} L 0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={label}
      role="img"
      style={{ overflow: 'visible' }}
    >
      {filled && <path d={area} fill={stroke} fillOpacity={0.14} />}
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 1px 1.5px ${stroke}40)` }}
      />
      {/* Endpoint dot — makes the most recent value pop. */}
      {points.length > 0 && (
        <>
          <circle
            cx={points[points.length - 1]![0]}
            cy={points[points.length - 1]![1]}
            r={3.5}
            fill={stroke}
            fillOpacity={0.2}
          />
          <circle
            cx={points[points.length - 1]![0]}
            cy={points[points.length - 1]![1]}
            r={2}
            fill={stroke}
          />
        </>
      )}
    </svg>
  );
}
