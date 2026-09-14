import type { CSSProperties } from 'react';

type Geometry = [x: number, y: number, width: number, height: number];

// Start/end geometry extracted from the owner's responsive-interface animation.
const frames: [Geometry, Geometry][] = [
  [[12, 4, 85, 68], [3, 29, 85, 42]],
  [[34, 30, 60, 45], [21, 3, 60, 63]],
  [[58, 45, 33, 33], [47, 45, 44, 33]],
];
const lines: [Geometry, Geometry][] = [
  [[60, 59, 27, 1], [49, 59, 40, 1]],
  [[60, 62, 9, 1], [60, 62, 29.017, 1]],
  [[63, 65, 26, 1], [53, 65, 21, 1]],
  [[63, 68, 4, 1], [49, 68, 16, 1]],
  [[60, 71, 22, 1], [54, 71, 35.014, 1]],
  [[73, 74, 15, 1], [58, 74, 8, 1]],
];

function geometryStyle([start, end]: [Geometry, Geometry]): CSSProperties {
  return Object.fromEntries(['x', 'y', 'width', 'height'].flatMap((key, i) => [
    [`--${key}-start`, `${start[i]}px`], [`--${key}-end`, `${end[i]}px`],
  ])) as CSSProperties;
}

export default function ScaleLogo() {
  return <svg className="thumbnail scale-logo" viewBox="0 0 100 80" aria-hidden="true" focusable="false">
    {frames.map((frame, i) => <rect key={i} className="scale-shape scale-frame" style={geometryStyle(frame)} stroke="#aaaba9" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
    <g className="scale-dots">
      <circle cx="2.5" cy="2.5" r="2.5" fill="var(--accent)" />
      <circle cx="9.5" cy="2.5" r="2" stroke="#aaaba9" fill="none" />
      <circle cx="16.5" cy="2.5" r="2" stroke="#aaaba9" fill="none" />
    </g>
    {lines.map((line, i) => <rect key={i} className="scale-shape" style={geometryStyle(line)} fill="#aaaba9" />)}
  </svg>;
}
