import { Distance, Line, Point } from "./geometry";
import { RenderArea, Scale } from "./rendering";
import { Tool, ToolContext, allToolTypes, noneTool } from "./tools";

export interface AppState {
  widthMetres: number;
  heightMetres: number;
  lines: ReadonlyArray<LineObject>;
};

export function initialAppState(): AppState {
  return {
    widthMetres: 40,
    heightMetres: 30,
    lines: [],
  };
}

export type AppUpdate =
  | {type: "addLine", lineObject: LineObject}
  | {type: "deleteObject", id: string};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "addLine":
      return {
        ...state,
        lines: [...state.lines, update.lineObject],
      };
    case "deleteObject":
      return {
        ...state,
        lines: state.lines.filter(line => line.id !== update.id),
      };
  }
}

export interface LineObject {
  id: string;
  line: Line;
}

export { Distance, Line, Point };
export { RenderArea, Scale };
export { Tool, ToolContext, allToolTypes, noneTool };
