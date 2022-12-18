import * as uuid from "uuid";

import { draftColor } from "../colors";
import { Line, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const crossToolType: ToolType<"Cross"> = {
  name: "Cross",
  create: (context) => new CrossTool({
    snapPoint: null,
  }, context),
}

interface LineToolState {
  snapPoint: Point | null;
}

class CrossTool implements Tool<"Cross"> {
  public readonly type = crossToolType;
  private readonly state: LineToolState;
  private readonly context: ToolContext;

  public constructor(state: LineToolState, context: ToolContext) {
    this.state = state;
    this.context = context;
  }

  public onMouseMove(mousePosition: Point): CrossTool {
    const snapDistance = this.context.squareWidth.divide(2);
    return new CrossTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    }, this.context);
  }

  public onMouseLeave(): CrossTool {
    return new CrossTool({
      ...this.state,
      snapPoint: null,
    }, this.context);
  }

  public onMouseLeftDown(): CrossTool {
    return this;
  }

  public onMouseLeftUp(): CrossTool {
    return this;
  }

  public render(renderArea: RenderArea) {
    const { snapPoint } = this.state;

    const radius = this.context.squareWidth.divide(2);

    return snapPoint !== null && (
      <g stroke={draftColor} strokeWidth={3} strokeLinecap="round">
        <line
          x1={renderArea.toPixels(snapPoint.x.subtract(radius))}
          y1={renderArea.toPixels(snapPoint.y.subtract(radius))}
          x2={renderArea.toPixels(snapPoint.x.add(radius))}
          y2={renderArea.toPixels(snapPoint.y.add(radius))}
        />
        <line
          x1={renderArea.toPixels(snapPoint.x.subtract(radius))}
          y1={renderArea.toPixels(snapPoint.y.add(radius))}
          x2={renderArea.toPixels(snapPoint.x.add(radius))}
          y2={renderArea.toPixels(snapPoint.y.subtract(radius))}
        />
      </g>
    );
  }
}
