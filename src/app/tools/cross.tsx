import * as uuid from "uuid";

import { draftColor } from "../colors";
import { Cross, Point } from "../geometry";
import { crossLines, RenderArea } from "../rendering";
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
    const { snapPoint } = this.state;
    if (snapPoint !== null) {
      const id = uuid.v4();
      const cross = Cross.from(snapPoint);
      this.context.sendUpdate({type: "addObject", object: {id, shape: {type: "cross", cross}}});
    }
    return new CrossTool({
      ...this.state,
    }, this.context);
  }

  public render(renderArea: RenderArea) {
    const { snapPoint } = this.state;

    return snapPoint !== null && (
      <g stroke={draftColor} strokeWidth={3} strokeLinecap="round">
        {crossLines(Cross.from(snapPoint), renderArea).map((line, crossLineIndex) => (
          <line
            key={crossLineIndex}
            x1={renderArea.toPixels(line.start.x)}
            y1={renderArea.toPixels(line.start.y)}
            x2={renderArea.toPixels(line.end.x)}
            y2={renderArea.toPixels(line.end.y)}
          />
        ))}
      </g>
    );
  }

  public withContext(context: ToolContext): CrossTool {
    return new CrossTool(this.state, context);
  }
}
