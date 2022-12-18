import { useLayoutEffect, useRef, useState } from "react";
import { rulerColor } from "../colors";
import { Distance, Line, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const rulerToolType: ToolType<"Ruler"> = {
  name: "Ruler",
  create: () => new RulerTool({
    lineStart: null,
    snapPoint: null,
  }),
}

interface RulerToolState {
  lineStart: Point | null;
  snapPoint: Point | null;
}

class RulerTool implements Tool<"Ruler"> {
  public readonly type = rulerToolType;
  private readonly state: RulerToolState;

  public constructor(state: RulerToolState) {
    this.state = state;
  }

  public onMouseMove(mousePosition: Point, context: ToolContext): RulerTool {
    const snapDistance = context.squareWidth.divide(2);
    return new RulerTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    });
  }

  public onMouseLeave(): RulerTool {
    return new RulerTool({
      ...this.state,
      snapPoint: null,
    });
  }

  public onMouseLeftDown(): RulerTool {
    return new RulerTool({
      ...this.state,
      lineStart: this.state.snapPoint,
    });
  }

  public onMouseLeftUp(): RulerTool {
    return new RulerTool({
      ...this.state,
      lineStart: null,
    });
  }

  public render(renderArea: RenderArea) {
    const { lineStart, snapPoint } = this.state;

    const distance = lineStart === null || snapPoint === null
      ? null
      : Line.from(lineStart, snapPoint).length();

    return (
      <g>
        {snapPoint !== null && (
          <circle cx={renderArea.toPixels(snapPoint.x)} cy={renderArea.toPixels(snapPoint.y)} r={pointRadius} fill={rulerColor} />
        )}
        {lineStart !== null && (
          <circle cx={renderArea.toPixels(lineStart.x)} cy={renderArea.toPixels(lineStart.y)} r={pointRadius} fill={rulerColor} />
        )}
        {lineStart !== null && snapPoint !== null && (
          <>
            <line
              x1={renderArea.toPixels(lineStart.x)}
              y1={renderArea.toPixels(lineStart.y)}
              x2={renderArea.toPixels(snapPoint.x)}
              y2={renderArea.toPixels(snapPoint.y)}
              stroke={rulerColor}
            />
            {distance !== null && (
              <DistanceTooltip
                distance={distance}
                renderArea={renderArea}
                snapPoint={snapPoint}
              />
            )}
          </>
        )}
      </g>
    );
  }
}

const pointRadius = 5;

interface DistanceTooltipProps {
  distance: Distance;
  renderArea: RenderArea;
  snapPoint: Point;
}

function DistanceTooltip(props: DistanceTooltipProps) {
  const { distance, renderArea, snapPoint } = props;

  const textRef = useRef<SVGTextElement>(null);
  const [textDimensions, setTextDimensions] = useState({width: 0, height: 0, top: 0});

  useLayoutEffect(() => {
    const textElement = textRef.current;
    if (textElement === null) {
      return;
    }

    const {width, height, y} = textElement.getBBox();

    setTextDimensions({width, height, top: y});

  }, [distance]);

  const padding = 5;
  const boxWidth = textDimensions.width + padding * 2;

  const displayOnLeft = renderArea.toPixels(snapPoint.x) + padding + boxWidth < renderArea.visibleWidthPixels();
  const left = displayOnLeft
    ? renderArea.toPixels(snapPoint.x) + pointRadius + padding
    : renderArea.toPixels(snapPoint.x) - pointRadius - padding - boxWidth;

  return (
    <>
      <rect
        x={left}
        y={textDimensions.top - padding}
        width={boxWidth}
        height={textDimensions.height + padding * 2}
        fill="#eee"
      />
      <text x={left + padding} y={renderArea.toPixels(snapPoint.y)} ref={textRef}>
        {distance.toMetres().toFixed(1)}m
      </text>
    </>
  );
}
