import { findLast } from "lodash";
import React from "react";
import { objectsInRenderOrder, shapeIsSelectableAt } from "..";

import { Point } from "../geometry";
import { Tool, ToolContext, ToolType } from "./base";

export const selectToolType: ToolType<"Select"> = {
  name: "Select",
  create: () => new SelectTool({
    mousePosition: null,
  }),
};

interface SelectToolState {
  mousePosition: Point | null;
}

class SelectTool implements Tool<"Select"> {
  public readonly type = selectToolType;
  private readonly state: SelectToolState;

  public constructor(state: SelectToolState) {
    this.state = state;
  }

  public onEscape(): SelectTool {
    return this;
  }

  public onMouseMove(mousePosition: Point): SelectTool {
    return new SelectTool({
      ...this.state,
      mousePosition,
    });
  }

  public onMouseLeave(): SelectTool {
    return new SelectTool({
      ...this.state,
      mousePosition: null,
    });
  }

  public onMouseLeftDown(context: ToolContext): SelectTool {
    const { mousePosition } = this.state;
    if (mousePosition === null) {
      return this;
    }
    // TODO: allow cycling
    const objectToSelect = findLast(
      objectsInRenderOrder(context.objects),
      object => shapeIsSelectableAt(object.shape, mousePosition, context),
    );
    context.selectObject(objectToSelect === undefined ? null : objectToSelect.id);
    return this;
  }

  public onMouseLeftUp(): SelectTool {
    return this;
  }

  public render(): React.ReactNode {
    return null;
  }
}