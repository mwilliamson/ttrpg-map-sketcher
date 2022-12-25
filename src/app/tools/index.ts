import { Tool, ToolContext, ToolType } from "./base";
import { crossToolType } from "./cross";
import { lineToolType } from "./line";
import { panTool, panToolType } from "./pan";
import { polygonToolType } from "./polygon";
import { rulerToolType } from "./ruler";
import { selectToolType } from "./select";
import { moveToolType, tokenToolType } from "./token";

export const allToolTypes: ReadonlyArray<ToolType<string>> = [
  panToolType,
  selectToolType,
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

