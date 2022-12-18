import * as uuid from "uuid";

import { draftColor } from "../colors";
import { Line, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const lineToolType: ToolType<"Line"> = {
  name: "Line",
  create: () => new LineTool({
    lineStart: null,
    snapPoint: null,
  }),
}

interface LineToolState {
  lineStart: Point | null;
  snapPoint: Point | null;
}

class LineTool implements Tool<"Line"> {
  public readonly type = lineToolType;
  private readonly state: LineToolState;

  public constructor(state: LineToolState) {
    this.state = state;
  }

  public onMouseMove(mousePosition: Point, context: ToolContext): LineTool {
    const snapDistance = context.squareWidth;
    return new LineTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    });
  }

  public onMouseLeave(): LineTool {
    return new LineTool({
      ...this.state,
      snapPoint: null,
    });
  }

  public onMouseLeftDown(): LineTool {
    return new LineTool({
      ...this.state,
      lineStart: this.state.snapPoint,
    });
  }

  public onMouseLeftUp(context: ToolContext): LineTool {
    const { lineStart, snapPoint } = this.state;
    if (lineStart !== null && snapPoint !== null && !lineStart.equals(snapPoint)) {
      const id = uuid.v4();
      const line = Line.from(lineStart, snapPoint);
      context.sendUpdate({type: "addObject", object: {id, shape: {type: "line", line}}});
    }
    return new LineTool({
      ...this.state,
      lineStart: null,
    });
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
