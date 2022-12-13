import { useEffect, useRef } from "react";
import rough from "roughjs";

import { AppState, AppUpdate, Distance, Point, RenderArea, Scale, Tool } from "./app";

interface MapViewProps {
  renderArea: RenderArea,
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
  tool: Tool;
  onToolChange: (newTool: Tool) => void;
}

export default function MapView(props: MapViewProps) {
  const { renderArea, state, tool, onToolChange } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (svgRef.current !== null && shapeGroupRef.current !== null) {
      const shapeGroup = shapeGroupRef.current;
      const rc = rough.svg(svgRef.current);
      shapeGroup.replaceChildren();

      state.lines.forEach(({line}, lineIndex) => {
        const lineElement = rc.line(
          renderArea.toPixels(line.start.x),
          renderArea.toPixels(line.start.y),
          renderArea.toPixels(line.end.x),
          renderArea.toPixels(line.end.y),
          // TODO: this is unstable when lines are removed
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
      <GridView renderArea={renderArea} />
      <g ref={shapeGroupRef}>
      </g>
      {tool.render(renderArea)}
    </svg>
  );
}

interface GridViewProps {
  renderArea: RenderArea,
}

function GridView(props: GridViewProps) {
  const { renderArea } = props;

  return (
    <g stroke="#ccc">
      {Distance.rangeInclusive(Distance.metres(0), renderArea.mapWidth, renderArea.squareWidth).map(x => (
        <line key={x.toMetres()} x1={renderArea.toPixels(x)} y1={0} x2={renderArea.toPixels(x)} y2={renderArea.visibleHeightPixels()} />
      ))}
      {Distance.rangeInclusive(Distance.metres(0), renderArea.mapHeight, renderArea.squareWidth).map(y => (
        <line key={y.toMetres()} x1={0} y1={renderArea.toPixels(y)} x2={renderArea.visibleWidthPixels()} y2={renderArea.toPixels(y)} />
      ))}
    </g>
  );
}
