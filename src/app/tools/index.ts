import { Tool, ToolContext, ToolType } from "./base";
import { lineToolType } from "./line";
import { noneTool, noneToolType } from "./none";
import { polygonToolType } from "./polygon";
import { rulerToolType } from "./ruler";

export const allToolTypes: ReadonlyArray<ToolType<string>> = [
    noneToolType,
    lineToolType,
    polygonToolType,
    rulerToolType,
];

export {
    Tool,
    ToolContext,
    noneTool,
}

