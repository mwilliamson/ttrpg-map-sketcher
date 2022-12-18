import * as uuid from "uuid";

import { draftColor } from "../colors";
import { Cross, Point } from "../geometry";
import { crossLines, RenderArea } from "../rendering";
import { Tool, ToolContext, ToolType } from "./base";

export const tokenToolType: ToolType<"Token"> = {
  name: "Token",
  create: () => new TokenTool({
    snapPoint: null,
  }),
}

interface TokenToolState {
  snapPoint: Point | null;
}

class TokenTool implements Tool<"Token"> {
  public readonly type = tokenToolType;
  private readonly state: TokenToolState;

  public constructor(state: TokenToolState) {
    this.state = state;
  }

  public onMouseMove(mousePosition: Point, context: ToolContext): TokenTool {
    const snapDistance = context.squareWidth.divide(2);
    return new TokenTool({
      ...this.state,
      snapPoint: mousePosition.snapTo(snapDistance),
    });
  }

  public onMouseLeave(): TokenTool {
    return new TokenTool({
      ...this.state,
      snapPoint: null,
    });
  }

  public onMouseLeftDown(): TokenTool {
    return this;
  }

  public onMouseLeftUp(context: ToolContext): TokenTool {
    return this;
  }

  public render(renderArea: RenderArea) {
    const { snapPoint } = this.state;

    // TODO: use renderArea.toPixels() or similar, differentiate coordinates from distance

    return snapPoint !== null && (
      <circle
        fill={draftColor}
        cx={renderArea.toPixels(snapPoint.x)}
        cy={renderArea.toPixels(snapPoint.y)}
        r={renderArea.scale.toPixels(renderArea.squareWidth.divide(2))}
      />
    );
  }
}
