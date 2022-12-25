import { findLast } from "lodash";
import * as uuid from "uuid";
import { updates } from "..";
import { draftColor } from "../colors";

import { Distance, Line, Point, Token } from "../geometry";
import { RenderArea } from "../rendering";
import { TokenDraftView, tokenRadius, TokenView } from "../rendering/token";
import { Tool, ToolContext, ToolType } from "./base";

export const tokenToolType: ToolType<"Token"> = {
  name: "Token",
  create: () => new TokenTool({
    snapPoint: null,
  }),
};

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
    const snapDistance = tokenSnapDistance(context);
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
      context.sendUpdate(updates.addObject({
        pageId: context.pageId,
        object: {id, shape: {type: "token", token}}
      }));
    }
    return this;
  }

  public render(renderArea: RenderArea) {
    const { snapPoint } = this.state;

    return snapPoint !== null && (
      <TokenDraftView
        center={snapPoint}
        renderArea={renderArea}
      />
    );
  }
}

export const moveToolType: ToolType<"Move"> = {
  name: "Move",
  create: () => new MoveTool({
    movingTokenId: null,
    position: null,
  }),
};

interface MoveToolState {
  movingTokenId: string | null;
  position: {mouse: Point, token: Point} | null;
}

class MoveTool implements Tool<"Move"> {
  public readonly type = moveToolType;
  private readonly state: MoveToolState;

  public constructor(state: MoveToolState) {
    this.state = state;
  }

  public onMouseMove(mousePosition: Point, context: ToolContext): MoveTool {
    return new MoveTool({
      ...this.state,
      position: {mouse: mousePosition, token: mousePosition.snapTo(tokenSnapDistance(context))},
    });
  }

  public onMouseLeave(): MoveTool {
    return new MoveTool({
      ...this.state,
      position: null,
    });
  }

  public onMouseLeftDown(context: ToolContext): MoveTool {
    const position = this.state.position;
    if (position === null) {
      return this;
    }

    const radius = tokenRadius(context);

    const token = findLast(
      context.objects,
      object => object.shape.type === "token" && Line.from(object.shape.token.center, position.mouse).isShorterThanOrEqualTo(radius)
    );

    return new MoveTool({
      ...this.state,
      movingTokenId: token !== undefined && token.shape.type === "token" ? token.id : null,
    });
  }

  public onMouseLeftUp(context: ToolContext): MoveTool {
    const {position} = this.state;
    const movingToken = this.movingToken(context);

    if (position !== null && movingToken !== null && !movingToken.center.equals(position.token)) {
      context.sendUpdate(updates.moveToken({
        pageId: context.pageId,
        objectId: this.state.movingTokenId!,
        previousCenter: movingToken.center,
        center: position.token,
      }));
    }

    return new MoveTool({
      ...this.state,
      movingTokenId: null,
    });
  }

  public render(renderArea: RenderArea, context: ToolContext) {
    const { position } = this.state;

    if (position === null){
      return null;
    }

    const movingToken = this.movingToken(context);

    if (movingToken === null) {
      return null;
    }

    return (
      <>
        <TokenView
          opacity={0.4}
          renderArea={renderArea}
          token={movingToken.move(position.token)}
        />
        <line
          x1={renderArea.toPixelCoordinate(movingToken.center.x)}
          y1={renderArea.toPixelCoordinate(movingToken.center.y)}
          x2={renderArea.toPixelCoordinate(position.token.x)}
          y2={renderArea.toPixelCoordinate(position.token.y)}
          stroke={draftColor}
          strokeWidth={2}
        />
      </>
    );
  }

  private movingToken(context: ToolContext): Token | null {
    if (this.state.movingTokenId === null){
      return null;
    }

    const tokenObject = context.objects.find(object => object.id === this.state.movingTokenId);

    if (tokenObject === undefined || tokenObject.shape.type !== "token") {
      return null;
    } else {
      return tokenObject.shape.token;
    }
  }
}

function tokenSnapDistance(context: ToolContext): Distance {
  return context.squareWidth.divide(2);
}
