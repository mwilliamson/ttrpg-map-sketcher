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

    const selectables = objectsInRenderOrder(context.objects).filter(
      object => shapeIsSelectableAt(object.shape, mousePosition, context),
    );
    const currentSelectionIndex = selectables.findIndex(selectable => selectable.id === context.selectedObjectId);
    const objectToSelect =
      selectables.length === 0 ? null :
      currentSelectionIndex <= 0 ? selectables[selectables.length - 1] :
      selectables[currentSelectionIndex - 1];

    context.selectObject(objectToSelect === null ? null : objectToSelect.id);
    return this;
  }

  public onMouseLeftUp(): SelectTool {
    return this;
  }

  public render(): React.ReactNode {
    return null;
  }
}