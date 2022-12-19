import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import rough from "roughjs";
import { RoughSVG } from "roughjs/bin/svg";

import { AppState, AppUpdate, Distance, IndexedMapObject, MapObject, Point, RenderArea, Tool, ToolContext } from "./app";
import { highlightColor } from "./app/colors";
import { CrossHighlightView, CrossView } from "./app/rendering/cross";
import { LineHighlightView, LineView } from "./app/rendering/line";
import { PolygonHighlightView, PolygonView } from "./app/rendering/polygon";
import { tokenRadius, TokenView } from "./app/rendering/token";
import { RoughSvgProvider } from "./app/rough";
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
        <LineHighlightView
          line={object.shape.line}
          renderArea={renderArea}
        />
      );
    case "polygon":
      return (
        <PolygonHighlightView
          polygon={object.shape.polygon}
          renderArea={renderArea}
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
        <LineView
          line={shape.line}
          renderArea={renderArea}
          seed={objectNumber}
        />
      );
    case "polygon":
      return (
        <PolygonView
          polygon={shape.polygon}
          renderArea={renderArea}
          seed={objectNumber}
        />
      )
    case "token":
      return (
        <TokenView
          renderArea={renderArea}
          token={shape.token}
        />
      );
    default:
      return assertNever(shape, "unhanded shape type");
  }
}
