import { rulerColor } from "../colors";
import { Distance, Line, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const rulerToolType: ToolType<"Ruler"> = {
  name: "Ruler",
  create: (context) => new RulerTool({
    lineStart: null,
    snapPoint: null,
  }, context),
}

interface RulerToolState {
  lineStart: Point | null;
  snapPoint: Point | null;
}

class RulerTool implements Tool<"Ruler"> {
  public readonly type = rulerToolType;
  private readonly state: RulerToolState;
  private readonly context: ToolContext;

  public constructor(state: RulerToolState, context: ToolContext) {
    this.state = state;
    this.context = context;
  }

  public onMouseMove(mousePosition: Point): RulerTool {
    const snapDistance = this.context.squareWidth.divide(2);
    return new RulerTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    }, this.context);
  }

  public onMouseLeave(): RulerTool {
    return new RulerTool({
      ...this.state,
      snapPoint: null,
    }, this.context);
  }

  public onMouseLeftDown(): RulerTool {
    return new RulerTool({
      ...this.state,
      lineStart: this.state.snapPoint,
    }, this.context);
  }

  public onMouseLeftUp(): RulerTool {
    return new RulerTool({
      ...this.state,
      lineStart: null,
    }, this.context);
  }

  public render(renderArea: RenderArea) {
    const { lineStart, snapPoint } = this.state;

    const distance = lineStart === null || snapPoint === null
      ? null
      : Line.from(lineStart, snapPoint).length();

    return (
      <g>
        {snapPoint !== null && (
          <circle cx={renderArea.toPixels(snapPoint.x)} cy={renderArea.toPixels(snapPoint.y)} r={5} fill={rulerColor} />
        )}
        {lineStart !== null && (
          <circle cx={renderArea.toPixels(lineStart.x)} cy={renderArea.toPixels(lineStart.y)} r={5} fill={rulerColor} />
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

interface DistanceTooltipProps {
  distance: Distance;
  renderArea: RenderArea;
  snapPoint: Point;
}

function DistanceTooltip(props: DistanceTooltipProps) {
  const { distance, renderArea, snapPoint } = props;

  const distanceXPadding = 5;
  const distanceWidth = 80;

  const displayOnLeft = renderArea.toPixels(snapPoint.x) + distanceXPadding + distanceWidth < renderArea.visibleWidthPixels();
  const left = displayOnLeft
    ? renderArea.toPixels(snapPoint.x) + distanceXPadding
    : renderArea.toPixels(snapPoint.x) - distanceWidth - distanceXPadding;

  return (
    <>
      <rect
        x={left}
        y={renderArea.toPixels(snapPoint.y) - 15}
        width={distanceWidth}
        height={30}
        fill="#fff"
      />
      <text x={left + distanceXPadding * 2} y={renderArea.toPixels(snapPoint.y)}>
        {distance.toMetres().toFixed(1)}m
      </text>
    </>
  );
}
