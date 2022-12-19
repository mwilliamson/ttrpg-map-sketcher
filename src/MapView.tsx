import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import rough from "roughjs";
import { RoughSVG } from "roughjs/bin/svg";

import { AppState, AppUpdate, Distance, IndexedMapObject, MapObject, Point, RenderArea, Tool, ToolContext } from "./app";
import { highlightColor } from "./app/colors";
import { CrossHighlightView, CrossView } from "./app/rendering/cross";
import { RoughLine, RoughPolygon, RoughSvgProvider } from "./app/rough";
import { tokenRadius } from "./app/tools/token";
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

export default function MapView(props: MapViewProps) {
  const { renderArea, state, tool, onToolChange, toolContext, highlightObject } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [roughSvg, setRoughSvg] = useState<RoughSVG | null>(null);

  const handleSvgRef = useRef((svgElement: SVGSVGElement) => svgElement !== null && setRoughSvg(rough.svg(svgElement)));

  const lastDragMousePosition = useRef<null | {x: number, y: number}>(null);

  const standardObjects: Array<IndexedMapObject> = [];
  const annotationObjects: Array<IndexedMapObject> = [];

  state.objects.forEach(object => {
    switch (object.shape.type) {
      case "cross":
        annotationObjects.push(object);
        return;
      case "line":
        standardObjects.push(object);
        return;
      case "polygon":
        standardObjects.push(object);
        return;
      case "token":
        standardObjects.push(object);
        return;
      default:
        return assertNever(object.shape, "unhanded shape type");
    }
  });

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
        ref={handleSvgRef.current}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <RoughSvgProvider value={roughSvg}>
          <GridView renderArea={renderArea} />
          {highlightObject !== null && (
            <HighlightedObjectView
              object={highlightObject}
              renderArea={renderArea}
            />
          )}
          <g>
            {standardObjects.map(object => (
              <ObjectView key={object.id} object={object} renderArea={renderArea} />
            ))}
          </g>
          <g>
            {annotationObjects.map(object => (
              <ObjectView key={object.id} object={object} renderArea={renderArea} />
            ))}
          </g>
        {tool.render(renderArea)}
        </RoughSvgProvider>
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
        <CrossHighlightView cross={object.shape.cross} renderArea={renderArea} />
      );
    case "line":
      return (
        <line
          stroke={highlightColor}
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
          stroke={highlightColor}
          strokeWidth={5}
          fill="none"
          points={pointsString}
        />
      );
    case "token":
      return (
        <circle
          fill={highlightColor}
          cx={renderArea.toPixelCoordinate(object.shape.token.center.x)}
          cy={renderArea.toPixelCoordinate(object.shape.token.center.y)}
          r={renderArea.distanceToPixels(tokenRadius(renderArea).multiply(1.5))}
        />
      );
    default:
      return assertNever(object.shape, "unhandled shape type");
  }
}

interface ObjectViewProps {
  object: IndexedMapObject;
  renderArea: RenderArea;
}

function ObjectView(props: ObjectViewProps) {
  const { object: { objectNumber, shape }, renderArea } = props;

  switch (shape.type) {
    case "cross":
      return (
        <CrossView
          cross={shape.cross}
          renderArea={renderArea}
          seed={objectNumber}
        />
      );
    case "line":
      return (
        <RoughLine
          x1={renderArea.toPixelCoordinate(shape.line.start.x)}
          y1={renderArea.toPixelCoordinate(shape.line.start.y)}
          x2={renderArea.toPixelCoordinate(shape.line.end.x)}
          y2={renderArea.toPixelCoordinate(shape.line.end.y)}
          seed={objectNumber}
        />
      );
    case "polygon":
      // TODO: memoise
      const points = shape.polygon.points.map(point => ({
        x: renderArea.toPixelCoordinate(point.x),
        y: renderArea.toPixelCoordinate(point.y),
      }));
      return (
        <RoughPolygon
          points={points}
          seed={objectNumber}
          fillColor={shape.polygon.fillColor}
        />
      );
    case "token":
      return (
        <circle
          stroke="#000"
          strokeWidth="3"
          fill={shape.token.color}
          cx={renderArea.toPixelCoordinate(shape.token.center.x)}
          cy={renderArea.toPixelCoordinate(shape.token.center.y)}
          r={renderArea.distanceToPixels(tokenRadius(renderArea))}
        />
      );
    default:
      return assertNever(shape, "unhanded shape type");
  }
}
