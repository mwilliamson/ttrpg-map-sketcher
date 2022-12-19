import * as uuid from "uuid";

import { draftColor } from "../colors";
import { Distance, Point, Token } from "../geometry";
import { RenderArea } from "../rendering";
import { tokenRadius } from "../rendering/token";
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
    const { snapPoint } = this.state;
    if (snapPoint !== null) {
      const id = uuid.v4();
      const token = Token.from(snapPoint, context.selectedColor);
      context.sendUpdate({type: "addObject", object: {id, shape: {type: "token", token}}});
    }
    return this;
  }

  public render(renderArea: RenderArea) {
    const { snapPoint } = this.state;

    return snapPoint !== null && (
      <circle
        fill={draftColor}
        cx={renderArea.toPixelCoordinate(snapPoint.x)}
        cy={renderArea.toPixelCoordinate(snapPoint.y)}
        r={renderArea.distanceToPixels(tokenRadius(renderArea))}
      />
    );
  }
}
