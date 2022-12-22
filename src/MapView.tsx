import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
import { RoughSVG } from "roughjs/bin/svg";

import { AppUpdate, Distance, NumberedMapObject, MapObject, Point, RenderArea, Tool, Page } from "./app";
import { CrossHighlightView, CrossView } from "./app/rendering/cross";
import { LineHighlightView, LineView } from "./app/rendering/line";
import { PolygonHighlightView, PolygonView } from "./app/rendering/polygon";
import { TokenHighlightView, TokenView } from "./app/rendering/token";
import { RoughSvgProvider } from "./app/rough";
import assertNever from "./util/assertNever";

import "./MapView.scss";
import { panToolType } from "./app/tools/pan";

interface MapViewProps {
  page: Page;
  sendUpdate: (update: AppUpdate) => void;
  tool: Tool;
  onToolChange: (newTool: Tool) => void;
  highlightObject: NumberedMapObject | null;
  selectedColor: string;
}

const zoomLevels = {
  min: -5,
  max: 5,
  default: 0,
};

export default function MapView(props: MapViewProps) {
  const { page, sendUpdate, tool, onToolChange, highlightObject, selectedColor } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const [roughSvg, setRoughSvg] = useState<RoughSVG | null>(null);

  const handleSvgRef = useRef((svgElement: SVGSVGElement) => svgElement !== null && setRoughSvg(rough.svg(svgElement)));

  const [zoomLevel, setZoomLevel] = useState(zoomLevels.default);

  function handleZoomChange(zoomDelta: number) {
    setZoomLevel(zoomLevel => clamp(zoomLevels.min, zoomLevel + zoomDelta / 100, zoomLevels.max));
  }

  function clamp(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  const lastPagePosition = useRef<null | Point>(null);
  const lastDragMousePosition = useRef<null | {x: number, y: number}>(null);

  const renderArea = RenderArea.from({
    pageDimensions: page.dimensions,
    zoomLevel,
  });

  const toolContext = {
    objects: page.objects,
    pageId: page.id,
    selectedColor: selectedColor,
    sendUpdate,
    squareWidth: renderArea.squareWidth,
  };

  const standardObjects: Array<NumberedMapObject> = [];
  const tokenObjects: Array<NumberedMapObject> = [];
  const annotationObjects: Array<NumberedMapObject> = [];

  page.objects.forEach(object => {
    if (highlightObject !== null && object.id === highlightObject.id) {
      return;
    }
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
        tokenObjects.push(object);
        return;
      default:
        return assertNever(object.shape, "unhandled shape type");
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
    lastPagePosition.current = Point.from(x, y);

    const container = containerRef.current;
    if (lastDragMousePosition.current !== null && container !== null) {
      const deltaX = lastDragMousePosition.current.x - event.clientX;
      const deltaY = lastDragMousePosition.current.y - event.clientY;
      lastDragMousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };

      container.scrollBy(deltaX, deltaY);
    }
  }

  function handleMouseLeave() {
    onToolChange(tool.onMouseLeave(toolContext));
  }

  function handleMouseDown(event: React.MouseEvent) {
    if (event.button === 0) {
      onToolChange(tool.onMouseLeftDown(toolContext));
    }

    if (isPan(event)) {
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
    }

    if (isPan(event)) {
      lastDragMousePosition.current = null;
    }
  }

  function isPan(event: React.MouseEvent) {
    return (event.button === 0 && tool.type === panToolType) || event.button === 2;
  }

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      if (event.deltaY !== 0 && event.deltaMode === WheelEvent.DOM_DELTA_PIXEL && lastPagePosition.current !== null) {
        zoomPositionRef.current = {
          viewport: {x: event.clientX, y: event.clientY},
          page: lastPagePosition.current,
        };
        handleZoomChange(-event.deltaY);
      }
    }

    containerRef.current?.addEventListener("wheel", handleWheel, {passive: false});

    return () => {
      containerRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [handleZoomChange]);

  const zoomPositionRef = useRef<{viewport: {x: number, y: number}, page: Point} | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const zoomPosition = zoomPositionRef.current;
    if (container === null || zoomPosition === null) {
      return;
    }
    const svg = container.firstChild as Element;
    const svgRect = svg.getBoundingClientRect();

    const svgX = renderArea.toPixelCoordinate(zoomPosition.page.x);
    const svgY = renderArea.toPixelCoordinate(zoomPosition.page.y);

    const viewportX = svgX + svgRect.left;
    const viewportY = svgY + svgRect.top;

    container.scrollBy({
      left: viewportX - zoomPosition.viewport.x,
      top:viewportY - zoomPosition.viewport.y,
      behavior: "instant" as any
    });

    zoomPositionRef.current = null;
  }, [zoomLevel]);

  return (
    <div className="MapView" ref={containerRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{display: "block", width: renderArea.visibleWidthPixels(), height: renderArea.visibleHeightPixels(), margin: "0 auto"}}
        ref={handleSvgRef.current}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <RoughSvgProvider value={roughSvg}>
          <GridView renderArea={renderArea} />
          <g>
            {standardObjects.map(object => (
              <ObjectView key={object.id} object={object} renderArea={renderArea} />
            ))}
          </g>
          <g>
            {tokenObjects.map(object => (
              <ObjectView key={object.id} object={object} renderArea={renderArea} />
            ))}
          </g>
          <g>
            {annotationObjects.map(object => (
              <ObjectView key={object.id} object={object} renderArea={renderArea} />
            ))}
          </g>

          {highlightObject !== null && (
            <g>
              <HighlightedObjectView
                object={highlightObject}
                renderArea={renderArea}
              />
              <ObjectView object={highlightObject} renderArea={renderArea} />
            </g>
          )}

          {tool.render(renderArea, toolContext)}
        </RoughSvgProvider>
      </svg>
    </div>
  );
}

interface GridViewProps {
  renderArea: RenderArea,
}

function GridView(props: GridViewProps) {
  const { renderArea } = props;

  return (
    <g stroke="#ccc">
      {Distance.rangeInclusive(Distance.metres(0), renderArea.pageWidth, renderArea.squareWidth).map(x => (
        <line key={x.toMetres()} x1={renderArea.toPixelCoordinate(x)} y1={0} x2={renderArea.toPixelCoordinate(x)} y2={renderArea.visibleHeightPixels()} />
      ))}
      {Distance.rangeInclusive(Distance.metres(0), renderArea.pageHeight, renderArea.squareWidth).map(y => (
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
        <TokenHighlightView
          renderArea={renderArea}
          token={object.shape.token}
        />
      );
    default:
      return assertNever(object.shape, "unhandled shape type");
  }
}

interface ObjectViewProps {
  object: NumberedMapObject;
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
      );
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
