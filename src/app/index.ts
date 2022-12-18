import { findLast } from "lodash";

import { Cross, Distance, Line, Point, Polygon, Token } from "./geometry";
import { RenderArea, Scale } from "./rendering";
import { Tool, ToolContext, allToolTypes, noneTool } from "./tools";

export interface AppState {
  objects: ReadonlyArray<IndexedMapObject>;
  nextObjectNumber: number;
  updates: ReadonlyArray<AppUpdate>;
};

export function initialAppState(): AppState {
  return {
    objects: [],
    nextObjectNumber: 1,
    updates: [],
  };
}

export type AppUpdate =
  | {type: "addObject", object: MapObject}
  | {type: "deleteObject", id: string};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  return {
    ...applyAppUpdateInner(state, update),
    updates: [...state.updates, update],
  };
}

function applyAppUpdateInner(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "addObject":
      return {
        ...state,
        objects: [
          ...state.objects,
          {...update.object, objectNumber: state.nextObjectNumber},
        ],
        nextObjectNumber: state.nextObjectNumber + 1,
      };
    case "deleteObject":
      return {
        ...state,
        objects: state.objects.filter(object => object.id !== update.id),
      };
  }
}

export function createUpdateToUndo(state: AppState, update: AppUpdate): AppUpdate | null {
  switch (update.type) {
    case "addObject":
      return {
        type: "deleteObject",
        id: update.object.id,
      };
    case "deleteObject":
      return findLast(
        state.updates,
        updateAdd => updateAdd.type === "addObject" && updateAdd.object.id === update.id,
      ) || null;
  }
}

export interface MapObject {
  id: string;
  shape: Shape;
}

export interface IndexedMapObject extends MapObject {
  objectNumber: number;
}

export type Shape =
  | {type: "cross", cross: Cross}
  | {type: "line", line: Line}
  | {type: "polygon", polygon: Polygon}
  | {type: "token", token: Token};

export { Cross, Distance, Line, Point, Polygon, Token };
export { RenderArea, Scale };
export { Tool, ToolContext, allToolTypes, noneTool };
