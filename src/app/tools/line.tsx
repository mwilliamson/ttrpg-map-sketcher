import * as uuid from "uuid";

import { Line, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { LineDraftView } from "../rendering/line";
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
      <LineDraftView
        start={lineStart === null ? snapPoint : lineStart}
        end={lineStart === null ? null : snapPoint}
        renderArea={renderArea}
      />
    );
  }
}
