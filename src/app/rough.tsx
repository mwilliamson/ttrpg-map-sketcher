import { createContext, useContext, useLayoutEffect, useRef } from "react";
import { RoughSVG } from "roughjs/bin/svg";

const RoughSvgContext = createContext<RoughSVG | null>(null);

export const RoughSvgProvider = RoughSvgContext.Provider;

interface RoughLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  seed: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export function RoughLine(props: RoughLineProps) {
  const { x1, y1, x2, y2, seed, strokeColor = "#000", strokeWidth = 1 } = props;

  const rc = useContext(RoughSvgContext);
  const containerRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    if (rc !== null && containerRef.current !== null) {
      const element = rc.line(x1, y1, x2, y2, {seed, stroke: strokeColor, strokeWidth});
      containerRef.current.replaceChildren(element);
    }
  }, [rc, x1, y1, x2, y2, seed, strokeColor, strokeWidth]);

  return (
    <g ref={containerRef}></g>
  )
}

interface RoughPolygonProps {
  points: ReadonlyArray<{x: number, y: number}>;
  seed: number;
  fillColor: string;
}

export function RoughPolygon(props: RoughPolygonProps) {
  const { points, seed, fillColor } = props;

  const rc = useContext(RoughSvgContext);
  const containerRef = useRef<SVGGElement>(null)

  useLayoutEffect(() => {
    if (rc !== null && containerRef.current !== null) {
      const element = rc.polygon(points.map(({x, y}) => [x, y]), {seed, fill: fillColor});
      containerRef.current.replaceChildren(element);
    }
  }, [rc, points, seed, fillColor]);

  return (
    <g ref={containerRef}></g>
  )
}
