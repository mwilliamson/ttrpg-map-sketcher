import { Cross, Distance, Line, Point } from "./geometry";

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
    mapWidth: Distance,
    mapHeight: Distance,
    squareWidth: Distance,
  }) {
    return new RenderArea({...options, padding: options.squareWidth.divide(2)});
  }

  private readonly scale: Scale;
  private readonly padding: Distance;
  public readonly mapWidth: Distance;
  public readonly mapHeight: Distance;
  public readonly squareWidth: Distance;

  private constructor({scale, padding, mapWidth, mapHeight, squareWidth}: {
    scale: Scale,
    padding: Distance,
    mapWidth: Distance,
    mapHeight: Distance,
    squareWidth: Distance,
  }) {
    this.scale = scale;
    this.padding = padding;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.squareWidth = squareWidth;
  }

  public visibleWidthPixels(): number {
    return this.scale.toPixels(this.mapWidth.add(this.padding.multiply(2)));
  }

  public visibleHeightPixels(): number {
    return this.scale.toPixels(this.mapHeight.add(this.padding.multiply(2)));
  }

  public toPixels(distance: Distance): number {
    return this.scale.toPixels(distance.add(this.padding));
  }

  public fromPixels(pixels: number): Distance {
    return this.scale.fromPixels(pixels).subtract(this.padding);
  }
}

export function crossLines(cross: Cross, renderArea: RenderArea): ReadonlyArray<Line> {
  const radius = renderArea.squareWidth.divide(2);
  const {center} = cross;

  return [
    Line.from(
      Point.from(
        center.x.subtract(radius),
        center.y.subtract(radius),
      ),
      Point.from(
        center.x.add(radius),
        center.y.add(radius),
      ),
    ),
    Line.from(
      Point.from(
        center.x.subtract(radius),
        center.y.add(radius),
      ),
      Point.from(
        center.x.add(radius),
        center.y.subtract(radius),
      ),
    ),
  ];
}
