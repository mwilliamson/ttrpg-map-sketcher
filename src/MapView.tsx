import { range } from "lodash";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

import { AppState, Distance, RenderArea, Scale } from "./app";

interface MapViewProps {
  state: AppState;
}

const mapWidth = Distance.metres(40);
const mapHeight = Distance.metres(30);
const scale = Scale.pixelsPerMetre(20);
const squareWidth = Distance.metres(2);
const renderArea = RenderArea.from({
  scale,
  padding: squareWidth.divide(2),
  width: mapWidth,
  height: mapHeight,
});

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

  const snapDistance = squareWidth;
  const snapPoint = mousePosition === null
    ? null
    : {
      x: mousePosition.x.roundToMultiple(snapDistance),
      y: mousePosition.y.roundToMultiple(snapDistance),
    };

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = renderArea.fromPixels(event.clientX - rect.left);
    const y = renderArea.fromPixels(event.clientY - rect.top);
    setMousePosition({x, y});
  }

  function handleMouseLeave() {
    setMousePosition(null);
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{width: renderArea.visibleWidthPixels(), height: renderArea.visibleHeightPixels()}}
      ref={svgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <GridView />
      <g ref={shapeGroupRef}>
      </g>
      <g>
        {snapPoint !== null && (
          <circle cx={renderArea.toPixels(snapPoint.x)} cy={renderArea.toPixels(snapPoint.y)} r={5} fill="#96ff00" />
        )}s
      </g>
    </svg>
  );
}

function GridView() {
  return (
    <g stroke="#ccc">
      {Distance.rangeInclusive(Distance.metres(0), mapWidth, squareWidth).map(x => (
        <line key={x.toMetres()} x1={renderArea.toPixels(x)} y1={0} x2={renderArea.toPixels(x)} y2={renderArea.visibleHeightPixels()} />
      ))}
      {Distance.rangeInclusive(Distance.metres(0), mapHeight, squareWidth).map(y => (
        <line key={y.toMetres()} x1={0} y1={renderArea.toPixels(y)} x2={renderArea.visibleWidthPixels()} y2={renderArea.toPixels(y)} />
      ))}
    </g>
  );
}
