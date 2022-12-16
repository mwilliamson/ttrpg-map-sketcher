import * as uuid from "uuid";

import { draftColor } from "../colors";
import { Line, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const lineToolType: ToolType<"Line"> = {
  name: "Line",
  create: (context) => new LineTool({
    lineStart: null,
    snapPoint: null,
  }, context),
}

interface LineToolState {
  lineStart: Point | null;
  snapPoint: Point | null;
}

class LineTool implements Tool<"Line"> {
  public readonly type = lineToolType;
  private readonly state: LineToolState;
  private readonly context: ToolContext;

  public constructor(state: LineToolState, context: ToolContext) {
    this.state = state;
    this.context = context;
  }

  public onMouseMove(mousePosition: Point): LineTool {
    const snapDistance = this.context.squareWidth;
    return new LineTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    }, this.context);
  }

  public onMouseLeave(): LineTool {
    return new LineTool({
      ...this.state,
      snapPoint: null,
    }, this.context);
  }

  public onMouseLeftDown(): LineTool {
    return new LineTool({
      ...this.state,
      lineStart: this.state.snapPoint,
    }, this.context);
  }

  public onMouseLeftUp(): LineTool {
    const { lineStart, snapPoint } = this.state;
    if (lineStart !== null && snapPoint !== null && !lineStart.equals(snapPoint)) {
      const id = uuid.v4();
      const line = Line.from(lineStart, snapPoint);
      this.context.sendUpdate({type: "addLine", objectId: id, line});
    }
    return new LineTool({
      ...this.state,
      lineStart: null,
    }, this.context);
  }

  public render(renderArea: RenderArea) {
    const { lineStart, snapPoint } = this.state;

    return (
      <g>
        {snapPoint !== null && (
          <circle cx={renderArea.toPixels(snapPoint.x)} cy={renderArea.toPixels(snapPoint.y)} r={5} fill={draftColor} />
        )}
        {lineStart !== null && (
          <circle cx={renderArea.toPixels(lineStart.x)} cy={renderArea.toPixels(lineStart.y)} r={5} fill={draftColor} />
        )}
        {lineStart !== null && snapPoint !== null && (
          <line
            x1={renderArea.toPixels(lineStart.x)}
            y1={renderArea.toPixels(lineStart.y)}
            x2={renderArea.toPixels(snapPoint.x)}
            y2={renderArea.toPixels(snapPoint.y)}
            stroke={draftColor}
          />
        )}
      </g>
    );
  }
}
