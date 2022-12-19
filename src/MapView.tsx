import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import rough from "roughjs";

import { AppState, AppUpdate, Distance, MapObject, Point, RenderArea, Tool, ToolContext } from "./app";
import { draftColor } from "./app/colors";
import { crossLines } from "./app/rendering";
import assertNever from "./assertNever";

interface MapViewProps {
  renderArea: RenderArea,
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
  tool: Tool;
  toolContext: ToolContext;
  onToolChange: (newTool: Tool) => void;
  highlightObject: MapObject | null;
}

const crossStrokeWidth = 3;

export default function MapView(props: MapViewProps) {
  const { renderArea, state, tool, onToolChange, toolContext, highlightObject } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const shapeGroupRef = useRef<SVGGElement>(null);
  const annotationGroupRef = useRef<SVGGElement>(null);

  const lastDragMousePosition = useRef<null | {x: number, y: number}>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const shapeGroup = shapeGroupRef.current;
    const annotationGroup = annotationGroupRef.current;

    if (svg !== null && shapeGroup !== null && annotationGroup) {
      const rc = rough.svg(svg);
      shapeGroup.replaceChildren();
      annotationGroup.replaceChildren();

      state.objects.forEach(({objectNumber, shape}) => {
        switch (shape.type) {
          case "cross":
            for (const crossLine of crossLines(shape.cross.center, renderArea)) {
              annotationGroup.appendChild(rc.line(
                renderArea.toPixelCoordinate(crossLine.start.x),
                renderArea.toPixelCoordinate(crossLine.start.y),
                renderArea.toPixelCoordinate(crossLine.end.x),
                renderArea.toPixelCoordinate(crossLine.end.y),
                {seed: objectNumber, stroke: shape.cross.color, strokeWidth: crossStrokeWidth},
              ));
            }
            return;
          case "line":
            const lineElement = rc.line(
              renderArea.toPixelCoordinate(shape.line.start.x),
              renderArea.toPixelCoordinate(shape.line.start.y),
              renderArea.toPixelCoordinate(shape.line.end.x),
              renderArea.toPixelCoordinate(shape.line.end.y),
              {seed: objectNumber},
            );
            shapeGroup.appendChild(lineElement);
            return;
          case "polygon":
            const polygonElement = rc.polygon(
              shape.polygon.points.map(point => [
                renderArea.toPixelCoordinate(point.x),
                renderArea.toPixelCoordinate(point.y),
              ]),
              {seed: objectNumber, fill: shape.polygon.fillColor},
            );
            shapeGroup.appendChild(polygonElement);
            return;
          case "token":
            const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circleElement.setAttribute("stroke", "#000");
            circleElement.setAttribute("stroke-width", "3");
            circleElement.setAttribute("fill", shape.token.color);
            circleElement.setAttribute("cx", renderArea.toPixelCoordinate(shape.token.center.x).toString());
            circleElement.setAttribute("cy", renderArea.toPixelCoordinate(shape.token.center.y).toString())
            circleElement.setAttribute("r", renderArea.distanceToPixels(renderArea.squareWidth.divide(2)).toString())
            shapeGroup.appendChild(circleElement);
            return;
          default:
            return assertNever(shape, "unhanded shape type");
        }
      });
    }
  }, [state.objects]);

  function handleContextMenu(event: React.SyntheticEvent) {
    event.preventDefault();
  }

  function handleMouseMove(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = renderArea.fromPixelCoordinate(event.clientX - rect.left);
    const y = renderArea.fromPixelCoordinate(event.clientY - rect.top);
    onToolChange(tool.onMouseMove(Point.from(x, y), toolContext));

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
    onToolChange(tool.onMouseLeave(toolContext));
  }

  function handleMouseDown(event: React.MouseEvent) {
    if (event.button === 0) {
      onToolChange(tool.onMouseLeftDown(toolContext));
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
      onToolChange(tool.onMouseLeftUp(toolContext));
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
          <HighlightedObjectView
            object={highlightObject}
            renderArea={renderArea}
          />
        )}
        <g ref={shapeGroupRef}>
        </g>
        <g ref={annotationGroupRef}>
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
        <line key={x.toMetres()} x1={renderArea.toPixelCoordinate(x)} y1={0} x2={renderArea.toPixelCoordinate(x)} y2={renderArea.visibleHeightPixels()} />
      ))}
      {Distance.rangeInclusive(Distance.metres(0), renderArea.mapHeight, renderArea.squareWidth).map(y => (
        <line key={y.toMetres()} x1={0} y1={renderArea.toPixelCoordinate(y)} x2={renderArea.visibleWidthPixels()} y2={renderArea.toPixelCoordinate(y)} />
      ))}
    </g>
  );
}

interface HighlightedObjectViewProps {
  object: MapObject;
  renderArea: RenderArea;
}

function HighlightedObjectView(props: HighlightedObjectViewProps) {
  const { object, renderArea } = props;

  switch (object.shape.type) {
    case "cross":
      return (
        <>
          {crossLines(object.shape.cross.center, renderArea).map((crossLine, crossLineIndex) => (
            <line
              key={crossLineIndex}
              stroke={draftColor}
              strokeWidth={crossStrokeWidth * 5}
              x1={renderArea.toPixelCoordinate(crossLine.start.x)}
              y1={renderArea.toPixelCoordinate(crossLine.start.y)}
              x2={renderArea.toPixelCoordinate(crossLine.end.x)}
              y2={renderArea.toPixelCoordinate(crossLine.end.y)}
            />
          ))}
        </>
      );
    case "line":
      return (
        <line
          stroke={draftColor}
          strokeWidth={5}
          x1={renderArea.toPixelCoordinate(object.shape.line.start.x)}
          y1={renderArea.toPixelCoordinate(object.shape.line.start.y)}
          x2={renderArea.toPixelCoordinate(object.shape.line.end.x)}
          y2={renderArea.toPixelCoordinate(object.shape.line.end.y)}
        />
      );
    case "polygon":
      const pointsString = object.shape.polygon.points.map(point => {
        const x = renderArea.toPixelCoordinate(point.x);
        const y = renderArea.toPixelCoordinate(point.y);
        return `${x},${y}`;
      }).join(" ");
      return (
        <polygon
          stroke={draftColor}
          strokeWidth={5}
          fill="none"
          points={pointsString}
        />
      );
    case "token":
      // TODO: remove duplication of circle radius (and probably other measurements in other shapes too)
      return (
        <circle
          fill={draftColor}
          cx={renderArea.toPixelCoordinate(object.shape.token.center.x)}
          cy={renderArea.toPixelCoordinate(object.shape.token.center.y)}
          r={renderArea.distanceToPixels(renderArea.squareWidth.divide(2)) + 10}
        />
      );
    default:
      return assertNever(object.shape, "unhandled shape type");
  }
}
