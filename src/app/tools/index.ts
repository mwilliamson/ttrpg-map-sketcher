import { Tool, ToolContext, ToolType } from "./base";
import { crossToolType } from "./cross";
import { lineToolType } from "./line";
import { panTool, panToolType } from "./pan";
import { polygonToolType } from "./polygon";
import { rulerToolType } from "./ruler";
import { moveToolType, tokenToolType } from "./token";

export const allToolTypes: ReadonlyArray<ToolType<string>> = [
  panToolType,
  lineToolType,
  polygonToolType,
  crossToolType,
  tokenToolType,
  moveToolType,
  rulerToolType,
];

export {
  Tool,
  ToolContext,
  panTool,
};

