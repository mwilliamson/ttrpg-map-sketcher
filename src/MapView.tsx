import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

import { AppState, AppUpdate, Distance, Line, Point, RenderArea, Scale } from "./app";

interface MapViewProps {
  sendUpdate: (update: AppUpdate) => void;
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
  const { sendUpdate, state } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);
  const [mousePosition, setMousePosition] = useState<null | Point>(null);
  const [lineStart, setLineStart] = useState<null | Point>(null);

  useEffect(() => {
    if (svgRef.current !== null && shapeGroupRef.current !== null) {
      const shapeGroup = shapeGroupRef.current;
      const rc = rough.svg(svgRef.current);
      shapeGroup.replaceChildren();

      state.lines.forEach((line, lineIndex) => {
        const lineElement = rc.line(
          renderArea.toPixels(line.start.x),
          renderArea.toPixels(line.start.y),
          renderArea.toPixels(line.end.x),
          renderArea.toPixels(line.end.y),
          {seed: lineIndex},
        );
        shapeGroup.appendChild(lineElement);
      });
    }
  }, [state.lines]);

  const snapDistance = squareWidth;
  const snapPoint = mousePosition === null
    ? null
    : mousePosition.snapTo(snapDistance);

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = renderArea.fromPixels(event.clientX - rect.left);
    const y = renderArea.fromPixels(event.clientY - rect.top);
    setMousePosition(Point.from(x, y));
  }

  function handleMouseLeave() {
    setMousePosition(null);
  }

  function handleMouseDown() {
    setLineStart(snapPoint);
  }

  function handleMouseUp() {
    if (lineStart !== null && snapPoint !== null) {
      sendUpdate({type: "addLine", line: Line.from(lineStart, snapPoint)});
    }
    setLineStart(null);
  }

  const draftColor = "#96ff00";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{width: renderArea.visibleWidthPixels(), height: renderArea.visibleHeightPixels()}}
      ref={svgRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <GridView />
      <g ref={shapeGroupRef}>
      </g>
      <g>
        {snapPoint !== null && (
          <circle cx={renderArea.toPixels(snapPoint.x)} cy={renderArea.toPixels(snapPoint.y)} r={5} fill={draftColor} />
        )}
        {lineStart !== null && (
          <circle cx={renderArea.toPixels(lineStart.x)} cy={renderArea.toPixels(lineStart.y)} r={5} fill={draftColor} />
        )}
        {lineStart !== null && snapPoint !== null && (
          <line
            x1={renderArea.toPixels(lineStart.x)}
            y1={renderArea.toPixels(lineStart.y)}
            x2={renderArea.toPixels(snapPoint.x)}
            y2={renderArea.toPixels(snapPoint.y)}
            stroke={draftColor}
          />
        )}
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
