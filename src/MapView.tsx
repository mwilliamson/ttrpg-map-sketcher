import { range } from "lodash";
import { useEffect, useRef, useState } from "react";
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
  const [mousePosition, setMousePosition] = useState<null | {x: Distance, y: Distance}>(null);

  useEffect(() => {
    if (svgRef.current !== null && shapeGroupRef.current !== null) {
      const rc = rough.svg(svgRef.current);
      const rect = rc.rectangle(100, 100, state.widthMetres, state.heightMetres);
      shapeGroupRef.current.replaceChildren(rect);
    }
  }, [state]);

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = scale.fromPixels(event.clientX - rect.left);
    const y = scale.fromPixels(event.clientY - rect.top);
    setMousePosition({x, y});
  }

  function handleMouseLeave() {
    setMousePosition(null);
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{width: scale.toPixels(mapWidth), height: scale.toPixels(mapHeight)}}
      ref={svgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <GridView />
      <g ref={shapeGroupRef}>
      </g>
      <g>
        {mousePosition !== null && (
          <circle cx={scale.toPixels(mousePosition.x)} cy={scale.toPixels(mousePosition.y)} r={5} fill="#96ff00" />
        )}s
      </g>
    </svg>
  );
}

function GridView() {
  return (
    <g stroke="#ccc">
      {range(scale.toPixels(squareWidth), scale.toPixels(mapWidth), scale.toPixels(squareWidth)).map(x => (
        <line x1={x} y1={0} x2={x} y2={scale.toPixels(mapHeight)} />
      ))}
      {range(scale.toPixels(squareWidth), scale.toPixels(mapWidth), scale.toPixels(squareWidth)).map(y => (
        <line x1={0} y1={y} x2={scale.toPixels(mapWidth)} y2={y} />
      ))}
    </g>
  );
}
