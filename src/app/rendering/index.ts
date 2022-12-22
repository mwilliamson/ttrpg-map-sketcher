import { PageDimensions } from "..";
import { Distance, Line, Point } from "../geometry";

export class Scale {
  public static pixelsPerMetre(pixelsPerMetre: number) {
    return new Scale(pixelsPerMetre);
  }

  private readonly pixelsPerMetre: number;

  private constructor(pixelsPerMetre: number) {
    this.pixelsPerMetre = pixelsPerMetre;
  }

  public multiply(by: number): Scale {
    return new Scale(this.pixelsPerMetre * by);
  }

  public toPixels(distance: Distance): number {
    return distance.toMetres() * this.pixelsPerMetre;
  }

  public fromPixels(pixels: number): Distance {
    return Distance.metres(pixels / this.pixelsPerMetre);
  }
}

export class RenderArea {
  public static from({pageDimensions, zoomLevel}: {
    pageDimensions: PageDimensions,
    zoomLevel: number,
  }) {
    return new RenderArea({pageDimensions, padding: pageDimensions.squareWidth.divide(2), zoomLevel});
  }

  private readonly pageDimensions: PageDimensions;
  private readonly padding: Distance;
  private readonly scale: Scale;

  private constructor({pageDimensions, padding, zoomLevel}: {
    pageDimensions: PageDimensions,
    padding: Distance,
    zoomLevel: number,
  }) {
    this.pageDimensions = pageDimensions;
    this.padding = padding;
    this.scale = pageDimensions.scale.multiply(1.2 ** zoomLevel);
  }

  public get pageWidth() {
    return this.pageDimensions.width;
  }

  public get pageHeight() {
    return this.pageDimensions.height;
  }

  public get squareWidth() {
    return this.pageDimensions.squareWidth;
  }

  public visibleWidthPixels(): number {
    return this.scale.toPixels(this.pageWidth.add(this.padding.multiply(2)));
  }

  public visibleHeightPixels(): number {
    return this.scale.toPixels(this.pageHeight.add(this.padding.multiply(2)));
  }

  public distanceToPixels(distance: Distance): number {
    return this.scale.toPixels(distance);
  }

  public toPixelCoordinate(distance: Distance): number {
    return this.scale.toPixels(distance.add(this.padding));
  }

  public fromPixelCoordinate(pixels: number): Distance {
    return this.scale.fromPixels(pixels).subtract(this.padding);
  }
}
