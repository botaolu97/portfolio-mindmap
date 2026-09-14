import { useEffect, useRef } from 'react';

// Geometry and motion tracks adapted from the owner's Framer script.
export default function SystemLogo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const button = svgRef.current?.closest('button');
    if (!button) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let progress = 0;
    let frame = 0;
    let hovered = false;
    const render = () => {
      ringRef.current?.setAttribute('transform', `rotate(${ringAngle(progress) * 180 / Math.PI} 39 39)`);
      const marker = markerPosition(progress);
      markerRef.current?.setAttribute('cx', String(marker.x));
      markerRef.current?.setAttribute('cy', String(marker.y));
    };
    const update = () => {
      cancelAnimationFrame(frame);
      if (reduced.matches) { progress = 0; render(); return; }
      const target = hovered || button.matches(':focus-visible') ? 1 : 0;
      const start = progress;
      const duration = 500 * Math.abs(target - start);
      if (!duration) return;
      const started = performance.now();
      const step = (now: number) => {
        const elapsed = Math.min(1, (now - started) / duration);
        progress = start + (target - start) * elapsed;
        render();
        if (elapsed < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const enter = () => { hovered = true; update(); };
    const leave = () => { hovered = false; update(); };
    button.addEventListener('pointerenter', enter);
    button.addEventListener('pointerleave', leave);
    button.addEventListener('focus', update);
    button.addEventListener('blur', update);
    reduced.addEventListener('change', update);
    render();
    return () => {
      cancelAnimationFrame(frame);
      button.removeEventListener('pointerenter', enter);
      button.removeEventListener('pointerleave', leave);
      button.removeEventListener('focus', update);
      button.removeEventListener('blur', update);
      reduced.removeEventListener('change', update);
    };
  }, []);
  return (
            <svg ref={svgRef} className="thumbnail system-logo" focusable="false"
                viewBox="0 0 100 80"
                width="100%"
                height="100%"
                aria-hidden="true"
            >
                <g transform="translate(10)">
                    <path
                        transform="translate(7 7)"
                        d="M32 0V31.9999M32 31.9999V64M32 31.9999L48 4.28719M32 31.9999L16 59.7128M32 31.9999L59.7128 15.9999M32 31.9999L4.28719 47.9999M32 31.9999L16 4.28719M32 31.9999L48 59.7128M32 31.9999L4.28719 15.9999M32 31.9999L59.7128 47.9999M32 31.9999L0 32M32 31.9999L64 32M46 32C46 39.732 39.732 46 32 46C24.268 46 18 39.732 18 32C18 24.268 24.268 18 32 18C39.732 18 46 24.268 46 32Z"
                        fill="none"
                        stroke="#aaaba9"
                    />
                    <circle
                        transform="translate(7 7)"
                        cx="32"
                        cy="32"
                        r="32"
                        stroke="#aaaba9"
                        fill="none"
                    />
                    <g ref={ringRef}>
                        <path
                            d="M38 0H40V4H38V0ZM38 74H40V78H38V74ZM18.634 5.72501L20.366 4.72501L22.366 8.18911L20.634 9.18911L18.634 5.72501ZM55.634 69.8109L57.366 68.8109L59.366 72.275L57.634 73.275L55.634 69.8109ZM4.72501 20.366L5.72501 18.6339L9.18911 20.6339L8.18911 22.366L4.72501 20.366ZM68.8109 57.366L69.8109 55.6339L73.275 57.6339L72.275 59.366L68.8109 57.366ZM4 38V40H0L0 38H4ZM78 38V40H74V38H78ZM8.18911 55.634L9.18911 57.366L5.72501 59.366L4.72501 57.634L8.18911 55.634ZM72.275 18.634L73.275 20.366L69.8109 22.366L68.8109 20.634L72.275 18.634ZM20.634 68.8109L22.3661 69.8109L20.3661 73.275L18.634 72.275L20.634 68.8109ZM57.634 4.72507L59.3661 5.72507L57.3661 9.18917L55.634 8.18917L57.634 4.72507Z"
                            fill="#aaaba9"
                        />
                    </g>
                </g>
                <ellipse
                    transform="translate(23 19)"
                    cx="26"
                    cy="20"
                    rx="26"
                    ry="20"
                    stroke="var(--accent)"
                    fill="none"
                />
                <circle ref={markerRef} cx={38.5} cy={20.5} r="3.5" fill="var(--accent)" />
            </svg>
  );
}

const ringCenter = { x: 49, y: 39 }
const ringRadius = { x: 26, y: 20 }
const markerRest = { x: 38.5, y: 20.5 }
const markerEnd = { x: 48.5, y: 59.5 }
const startAngle = Math.atan2(
    (markerRest.y - ringCenter.y) / ringRadius.y,
    (markerRest.x - ringCenter.x) / ringRadius.x
)
const endAngle =
    Math.atan2(
        (markerEnd.y - ringCenter.y) / ringRadius.y,
        (markerEnd.x - ringCenter.x) / ringRadius.x
    ) -
    Math.PI * 2
const leftmostPathProgress = (startAngle + Math.PI) / (startAngle - endAngle)

function ringAngle(progress: number) {
    return track(
        progress,
        [
            [0, 0],
            [0.00041, 0],
            [0.99914, Math.PI],
            [0.99995, -Math.PI],
            [0.99999, -Math.PI / 2],
            [1, -Math.PI / 2],
        ],
        ["linear", easeInOut, "easeOut", easeInOut, "linear"]
    )
}

function markerPosition(progress: number) {
    const pathProgress = track(
        progress,
        [
            [0, 0],
            [0.50298, leftmostPathProgress],
            [0.99995, 1],
            [1, 1],
        ],
        ["easeIn", "easeOut", "linear"]
    )
    const angle = startAngle + (endAngle - startAngle) * pathProgress
    return {
        x:
            progress === 0
                ? markerRest.x
                : ringCenter.x + ringRadius.x * Math.cos(angle),
        y:
            progress === 0
                ? markerRest.y
                : ringCenter.y + ringRadius.y * Math.sin(angle),
    }
}

function track(value: number, points: [number, number][], easings: (string | ((value: number) => number))[]) {
    for (let index = 0; index < points.length - 1; index++) {
        const [start, startValue] = points[index]
        const [end, endValue] = points[index + 1]
        if (value <= end) {
            const local = Math.max(
                0,
                Math.min(1, (value - start) / (end - start || 1))
            )
            const eased = easing(easings[index], local)
            return startValue + (endValue - startValue) * eased
        }
    }
    return points[points.length - 1][1]
}

function easing(name: string | ((value: number) => number), value: number) {
    if (typeof name === "function") return name(value)
    if (name === "easeIn") return value * value
    if (name === "easeOut") return 1 - (1 - value) * (1 - value)
    return value
}

function easeInOut(value: number) {
    return cubicBezier(0.5, 0, 0.5, 1, value)
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number, value: number) {
    let low = 0
    let high = 1
    for (let index = 0; index < 16; index++) {
        const t = (low + high) / 2
        const x = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3
        if (x < value) low = t
        else high = t
    }
    const t = (low + high) / 2
    return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3
}

