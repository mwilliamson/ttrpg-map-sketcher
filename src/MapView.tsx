import { useEffect, useRef } from "react";
import rough from "roughjs";

import { AppState, AppUpdate, Distance, Point, RenderArea, Scale, Tool } from "./app";

interface MapViewProps {
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
  tool: Tool;
  onToolChange: (newTool: Tool) => void;
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
  const { state, tool, onToolChange } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);

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
          {seed: lineIndex + 1},
        );
        shapeGroup.appendChild(lineElement);
      });
    }
  }, [state.lines]);

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = renderArea.fromPixels(event.clientX - rect.left);
    const y = renderArea.fromPixels(event.clientY - rect.top);
    onToolChange(tool.onMouseMove(Point.from(x, y)));
  }

  function handleMouseLeave() {
    onToolChange(tool.onMouseLeave());
  }

  function handleMouseDown() {
    onToolChange(tool.onMouseDown());
  }

  function handleMouseUp() {
    onToolChange(tool.onMouseUp());
  }

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
      {tool.render(renderArea)}
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
