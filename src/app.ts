export interface AppState {
  widthMetres: number;
  heightMetres: number;
};

export function initialAppState(): AppState {
  return {
    widthMetres: 100,
    heightMetres: 100,
  };
}

export type AppUpdate =
  | {type: "setDimensions", widthMetres: number, heightMetres: number};

export function applyAppUpdate(state: AppState, update: AppUpdate): AppState {
  switch (update.type) {
    case "setDimensions":
      return {
        ...state,
        widthMetres: update.widthMetres,
        heightMetres: update.heightMetres,
      };
  }
}
