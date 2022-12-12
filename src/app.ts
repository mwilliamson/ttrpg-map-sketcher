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

export class Distance {
  public static metres(metres: number) {
    return new Distance(metres);
  }

  private readonly metres: number;

  private constructor(metres: number) {
    this.metres = metres;
  }

  public toMetres(): number {
    return this.metres;
  }
}

export class Scale {
  public static pixelsPerMetre(pixelsPerMetre: number) {
    return new Scale(pixelsPerMetre);
  }

  private readonly pixelsPerMetre: number;

  private constructor(pixelsPerMetre: number) {
    this.pixelsPerMetre = pixelsPerMetre;
  }

  public pixels(distance: Distance): number {
    return distance.toMetres() * this.pixelsPerMetre;
  }
}
