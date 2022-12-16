import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import rough from "roughjs";

import { AppState, AppUpdate, Distance, LineObject, Point, RenderArea, Tool } from "./app";
import { draftColor } from "./app/colors";

interface MapViewProps {
  renderArea: RenderArea,
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
  tool: Tool;
  onToolChange: (newTool: Tool) => void;
  highlightObject: LineObject | null;
}

export default function MapView(props: MapViewProps) {
  const { renderArea, state, tool, onToolChange, highlightObject } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);

  const lastDragMousePosition = useRef<null | {x: number, y: number}>(null);

  useEffect(() => {
    if (svgRef.current !== null && shapeGroupRef.current !== null) {
      const shapeGroup = shapeGroupRef.current;
      const rc = rough.svg(svgRef.current);
      shapeGroup.replaceChildren();

      state.lines.forEach(({index, line}) => {
        const lineElement = rc.line(
          renderArea.toPixels(line.start.x),
          renderArea.toPixels(line.start.y),
          renderArea.toPixels(line.end.x),
          renderArea.toPixels(line.end.y),
          {seed: index + 1},
        );
        shapeGroup.appendChild(lineElement);
      });
    }
  }, [state.lines]);

  function handleContextMenu(event: React.SyntheticEvent) {
    event.preventDefault();
  }

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = renderArea.fromPixels(event.clientX - rect.left);
    const y = renderArea.fromPixels(event.clientY - rect.top);
    onToolChange(tool.onMouseMove(Point.from(x, y)));

    const container = containerRef.current;
    if (lastDragMousePosition.current !== null && container !== null) {
      const deltaX = lastDragMousePosition.current.x - event.clientX;
      const deltaY = lastDragMousePosition.current.y - event.clientY;
      lastDragMousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      }

      container.scrollBy(deltaX, deltaY);
    }
  }

  function handleMouseLeave() {
    onToolChange(tool.onMouseLeave());
  }

  function handleMouseDown(event: React.MouseEvent) {
    if (event.button === 0) {
      onToolChange(tool.onMouseLeftDown());
    } else if (event.button === 2) {
      event.preventDefault();
      if (containerRef.current !== null) {
        lastDragMousePosition.current = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    }
  }

  function handleMouseUp(event: React.MouseEvent) {
    if (event.button === 0) {
      onToolChange(tool.onMouseLeftUp());
    } else if (event.button === 2) {
      lastDragMousePosition.current = null;
    }
  }

  return (
    <Box height="100%" overflow="auto" ref={containerRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{width: renderArea.visibleWidthPixels(), height: renderArea.visibleHeightPixels(), margin: "0 auto"}}
        ref={svgRef}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <GridView renderArea={renderArea} />
        {highlightObject !== null && (
          <line
            stroke={draftColor}
            strokeWidth={5}
            x1={renderArea.toPixels(highlightObject.line.start.x)}
            y1={renderArea.toPixels(highlightObject.line.start.y)}
            x2={renderArea.toPixels(highlightObject.line.end.x)}
            y2={renderArea.toPixels(highlightObject.line.end.y)}
          />
        )}
        <g ref={shapeGroupRef}>
        </g>
        {tool.render(renderArea)}
      </svg>
    </Box>
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
