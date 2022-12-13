import { Distance } from "./geometry";

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
