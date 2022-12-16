import { findLast } from "lodash";

import { Distance, Line, Point } from "./geometry";
import { RenderArea, Scale } from "./rendering";
import { Tool, ToolContext, allToolTypes, noneTool } from "./tools";

export interface AppState {
  lines: ReadonlyArray<LineObject>;
  nextObjectIndex: number;
  updates: ReadonlyArray<AppUpdate>;
};

export function initialAppState(): AppState {
  return {
    lines: [],
    nextObjectIndex: 0,
    updates: [],
  };
}

export type AppUpdate =
  | {type: "addLine", objectId: string, line: Line}
  | {type: "deleteObject", id: string};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  return {
    ...applyAppUpdateInner(state, update),
    updates: [...state.updates, update],
  };
}

function applyAppUpdateInner(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "addLine":
      return {
        ...state,
        lines: [
          ...state.lines,
          {id: update.objectId, index: state.nextObjectIndex, line: update.line},
        ],
        nextObjectIndex: state.nextObjectIndex + 1,
      };
    case "deleteObject":
      return {
        ...state,
        lines: state.lines.filter(line => line.id !== update.id),
      };
  }
}

export function createUpdateToUndo(state: AppState, update: AppUpdate): AppUpdate | null {
  switch (update.type) {
    case "addLine":
      return {
        type: "deleteObject",
        id: update.objectId,
      };
    case "deleteObject":
      return findLast(
        state.updates,
        updateAdd => updateAdd.type === "addLine" && updateAdd.objectId === update.id,
      ) || null;
  }
}

export interface LineObject {
  id: string;
  index: number;
  line: Line;
}

export { Distance, Line, Point };
export { RenderArea, Scale };
export { Tool, ToolContext, allToolTypes, noneTool };
