export interface AppState {
  widthMetres: number;
  heightMetres: number;
};

export function initialAppState(): AppState {
  return {
    widthMetres: 40,
    heightMetres: 30,
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

  public static rangeInclusive(from: Distance, to: Distance, step: Distance): Array<Distance> {
    const result: Array<Distance> = [];

    for (let x = from.metres; x <= to.metres; x += step.metres) {
      result.push(Distance.metres(x));
    }

    return result;
  }

  private readonly metres: number;

  private constructor(metres: number) {
    this.metres = metres;
  }

  public add(other: Distance): Distance {
    return new Distance(this.metres + other.metres);
  }

  public subtract(other: Distance): Distance {
    return new Distance(this.metres - other.metres);
  }

  public multiply(by: number): Distance {
    return new Distance(this.metres * by);
  }

  public divide(by: number): Distance {
    return new Distance(this.metres / by);
  }

  public toMetres(): number {
    return this.metres;
  }

  public roundToMultiple(interval: Distance): Distance {
    return new Distance(Math.round(this.metres / interval.metres) * interval.metres);
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

  public toPixels(distance: Distance): number {
    return distance.toMetres() * this.pixelsPerMetre;
  }

  public fromPixels(pixels: number): Distance {
    return Distance.metres(pixels / this.pixelsPerMetre);
  }
}

export class RenderArea {
  public static from(options: {
    scale: Scale,
    padding: Distance,
    width: Distance,
    height: Distance,
  }) {
    return new RenderArea(options);
  }

  private readonly scale: Scale;
  private readonly padding: Distance;
  private readonly width: Distance;
  private readonly height: Distance;

  private constructor({scale, padding, width, height}: {
    scale: Scale,
    padding: Distance,
    width: Distance,
    height: Distance,
  }) {
    this.scale = scale;
    this.padding = padding;
    this.width = width;
    this.height = height;
  }

  public visibleWidthPixels(): number {
    return this.scale.toPixels(this.width.add(this.padding.multiply(2)));
  }

  public visibleHeightPixels(): number {
    return this.scale.toPixels(this.height.add(this.padding.multiply(2)));
  }

  public toPixels(distance: Distance): number {
    return this.scale.toPixels(distance.add(this.padding));
  }

  public fromPixels(pixels: number): Distance {
    return this.scale.fromPixels(pixels).subtract(this.padding);
  }
}
