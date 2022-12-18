import { Tool, ToolType } from "./base";

export const noneToolType: ToolType<"None"> = {
  name: "None",
  create: () => noneTool,
};

export const noneTool: Tool<"None"> = {
  type: noneToolType,
  onMouseMove: () => noneTool,
  onMouseLeave: () => noneTool,
  onMouseLeftDown: () => noneTool,
  onMouseLeftUp: () => noneTool,
  render: () => null,
  withContext: () => noneTool,
}

export type NoneTool = typeof noneTool;
