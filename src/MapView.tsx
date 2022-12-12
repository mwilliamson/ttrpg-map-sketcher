import { range } from "lodash";
import { useEffect, useRef } from "react";
import rough from "roughjs";

import { AppState } from "./app";

interface MapViewProps {
  state: AppState;
}

const mapWidthMetres = 100;
const mapHeightMetres = 100;
const pixelsPerMetre = 8;
const squareWidthMetres = 5;

export default function MapView(props: MapViewProps) {
  const { state } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (svgRef.current !== null && shapeGroupRef.current !== null) {
      const rc = rough.svg(svgRef.current);
      const rect = rc.rectangle(100, 100, state.widthMetres, state.heightMetres);
      shapeGroupRef.current.replaceChildren(rect);
    }
  }, [state]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{width: mapWidthMetres * pixelsPerMetre, height: mapHeightMetres * pixelsPerMetre}} ref={svgRef}>
      <GridView />
      <g ref={shapeGroupRef}>
      </g>
    </svg>
  );
}

function GridView() {
  return (
    <g stroke="#ccc">
      {range(squareWidthMetres, mapWidthMetres, squareWidthMetres).map(x => (
        <line x1={x * pixelsPerMetre} y1={0} x2={x * pixelsPerMetre} y2={mapHeightMetres * pixelsPerMetre} />
      ))}
      {range(squareWidthMetres, mapWidthMetres, squareWidthMetres).map(y => (
        <line x1={0} y1={y * pixelsPerMetre} x2={mapWidthMetres * pixelsPerMetre} y2={y * pixelsPerMetre} />
      ))}
    </g>
  );
}
