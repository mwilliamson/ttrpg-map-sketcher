import { Tool, ToolContext, ToolType } from "./base";
import { crossToolType } from "./cross";
import { lineToolType } from "./line";
import { noneTool, noneToolType } from "./none";
import { polygonToolType } from "./polygon";
import { rulerToolType } from "./ruler";
import { tokenToolType } from "./token";

export const allToolTypes: ReadonlyArray<ToolType<string>> = [
    noneToolType,
    lineToolType,
    polygonToolType,
    crossToolType,
    tokenToolType,
    rulerToolType,
];

export {
    Tool,
    ToolContext,
    noneTool,
}

