import { range } from "lodash";
import { useEffect, useRef } from "react";
import rough from "roughjs";

import { AppState, Distance, Scale } from "./app";

interface MapViewProps {
  state: AppState;
}

const mapWidth = Distance.metres(100);
const mapHeight = Distance.metres(100);
const scale = Scale.pixelsPerMetre(8);
const squareWidth = Distance.metres(5);

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
    <svg xmlns="http://www.w3.org/2000/svg" style={{width: scale.pixels(mapWidth), height: scale.pixels(mapHeight)}} ref={svgRef}>
      <GridView />
      <g ref={shapeGroupRef}>
      </g>
    </svg>
  );
}

function GridView() {
  return (
    <g stroke="#ccc">
      {range(scale.pixels(squareWidth), scale.pixels(mapWidth), scale.pixels(squareWidth)).map(x => (
        <line x1={x} y1={0} x2={x} y2={scale.pixels(mapHeight)} />
      ))}
      {range(scale.pixels(squareWidth), scale.pixels(mapWidth), scale.pixels(squareWidth)).map(y => (
        <line x1={0} y1={y} x2={scale.pixels(mapWidth)} y2={y} />
      ))}
    </g>
  );
}
