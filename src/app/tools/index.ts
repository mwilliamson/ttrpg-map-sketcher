import { Tool, ToolContext, ToolType } from "./base";
import { lineToolType } from "./line";
import { noneTool, noneToolType } from "./none";

export const allToolTypes: ReadonlyArray<ToolType<string>> = [noneToolType, lineToolType];

export {
    Tool,
    ToolContext,
    noneTool,
}

