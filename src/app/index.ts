import { Distance, Line, Point } from "./geometry";
import { RenderArea, Scale } from "./rendering";

export interface AppState {
  widthMetres: number;
  heightMetres: number;
  lines: ReadonlyArray<Line>;
};

export function initialAppState(): AppState {
  return {
    widthMetres: 40,
    heightMetres: 30,
    lines: [],
  };
}

export type AppUpdate =
  | {type: "setDimensions", widthMetres: number, heightMetres: number}
  | {type: "addLine", line: Line};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "setDimensions":
      return {
        ...state,
        widthMetres: update.widthMetres,
        heightMetres: update.heightMetres,
      };
    case "addLine":
      return {
        ...state,
        lines: [...state.lines, update.line],
      }
  }
}

export { Distance, Line, Point };
export { RenderArea, Scale };
