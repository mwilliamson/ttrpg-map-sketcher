import { Tool, ToolType } from "./base";

export const panToolType: ToolType<"Pan"> = {
  name: "Pan",
  create: () => panTool,
};

export const panTool: Tool<"Pan"> = {
  type: panToolType,
  onMouseMove: () => panTool,
  onMouseLeave: () => panTool,
  onMouseLeftDown: () => panTool,
  onMouseLeftUp: () => panTool,
  render: () => null,
};

export type PanTool = typeof panTool;
