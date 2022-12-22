import * as uuid from "uuid";
import { updates } from "..";

import { Cross, Point } from "../geometry";
import { RenderArea } from "../rendering";
import { CrossDraftView } from "../rendering/cross";
import { Tool, ToolContext, ToolType } from "./base";

export const crossToolType: ToolType<"Cross"> = {
  name: "Cross",
  create: () => new CrossTool({
    snapPoint: null,
  }),
};

interface CrossToolState {
  snapPoint: Point | null;
}

class CrossTool implements Tool<"Cross"> {
  public readonly type = crossToolType;
  private readonly state: CrossToolState;

  public constructor(state: CrossToolState) {
    this.state = state;
  }

  public onMouseMove(mousePosition: Point, context: ToolContext): CrossTool {
    const snapDistance = context.squareWidth.divide(2);
    return new CrossTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    });
  }

  public onMouseLeave(): CrossTool {
    return new CrossTool({
      ...this.state,
      snapPoint: null,
    });
  }

  public onMouseLeftDown(): CrossTool {
    return this;
  }

  public onMouseLeftUp(context: ToolContext): CrossTool {
    const { snapPoint } = this.state;
    if (snapPoint !== null) {
      const id = uuid.v4();
      const cross = Cross.from(snapPoint, context.selectedColor);
      context.sendUpdate(updates.addObject({
        pageId: context.pageId,
        object: {id, shape: {type: "cross", cross}},
      }));
    }
    return this;
  }

  public render(renderArea: RenderArea) {
    const { snapPoint } = this.state;

    return snapPoint !== null && (
      <CrossDraftView center={snapPoint} renderArea={renderArea} />
    );
  }
}
