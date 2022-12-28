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

  public equals(other: Distance): boolean {
    return this.metres === other.metres;
  }

  public lessThanOrEqualTo(other: Distance): boolean {
    return this.metres <= other.metres;
  }

  public toString(): string {
    return `${this.metres}m`;
  }
}

export class Point {
  public static from(x: Distance, y: Distance) {
    return new Point(x, y);
  }

  public readonly x: Distance;
  public readonly y: Distance;

  private constructor(x: Distance, y: Distance) {
    this.x = x;
    this.y = y;
  }

  public snapTo(interval: Distance): Point {
    return new Point(
      this.x.roundToMultiple(interval),
      this.y.roundToMultiple(interval),
    );
  }

  public equals(other: Point): boolean {
    return this.x.equals(other.x) && this.y.equals(other.y);
  }
}

export class Line {
  public static from(start: Point, end: Point) {
    return new Line(start, end);
  }

  public readonly start: Point;
  public readonly end: Point;

  public constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }

  public length(): Distance {
    const x = this.start.x.toMetres() - this.end.x.toMetres();
    const y = this.start.y.toMetres() - this.end.y.toMetres();
    return Distance.metres(Math.sqrt(x * x + y * y));
  }

  public isShorterThanOrEqualTo(distance: Distance): boolean {
    const x = this.start.x.toMetres() - this.end.x.toMetres();
    const y = this.start.y.toMetres() - this.end.y.toMetres();
    const distanceMetres = distance.toMetres();
    return x * x + y * y <= distanceMetres * distanceMetres;
  }
}

export class Polygon {
  public static from(points: ReadonlyArray<Point>, fillColor: string) {
    return new Polygon(points, fillColor);
  }

  public readonly points: ReadonlyArray<Point>;
  public readonly fillColor: string;

  private constructor(points: ReadonlyArray<Point>, fillColor: string) {
    this.points = points;
    this.fillColor = fillColor;
  }

  public withFillColor(fillColor: string): Polygon {
    return new Polygon(this.points, fillColor);
  }
}

export class Cross {
  public static from(center: Point, color: string) {
    return new Cross(center, color);
  }

  public readonly center: Point;
  public readonly color: string;

  private constructor(center: Point, color: string) {
    this.center = center;
    this.color = color;
  }

  public withColor(color: string): Cross {
    return new Cross(this.center, color);
  }
}

export class Token {
  public static readonly textChoices = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  public static from(center: Point, color: string, text: string) {
    return new Token(center, color, text);
  }

  public readonly center: Point;
  public readonly color: string;
  public readonly text: string;

  private constructor(center: Point, color: string, text: string) {
    this.center = center;
    this.color = color;
    this.text = text;
  }

  public move(center: Point): Token {
    return new Token(center, this.color, this.text);
  }

  public withColor(color: string): Token {
    return new Token(this.center, color, this.text);
  }
}

export function findClosestPointOnLine(line: Line, point: Point): Point | null {
  const { start, end } = line;
  const startToPoint = {
    x: point.x.subtract(start.x),
    y: point.y.subtract(start.y),
  };
  const startToEnd = {
    x: end.x.subtract(start.x),
    y: end.y.subtract(start.y),
  };
  const startToEndSquared = startToEnd.x.toMetres() ** 2 + startToEnd.y.toMetres() ** 2;
  const dotProduct = startToPoint.x.toMetres() * startToEnd.x.toMetres() + startToPoint.y.toMetres() * startToEnd.y.toMetres();
  const distance = dotProduct / startToEndSquared;
  if (distance < 0 || distance > 1) {
    return null;
  }
  return Point.from(
    start.x.add(startToEnd.x.multiply(distance)),
    start.y.add(startToEnd.y.multiply(distance)),
  );
}

export function polygonContainsPoint(
  polygon: Polygon,
  point: Point,
): boolean {
  let result = false;
  const pointX = point.x.toMetres();
  const pointY = point.y.toMetres();

  for (let polygonPointIndex = 0; polygonPointIndex < polygon.points.length; polygonPointIndex++) {
    const start = polygon.points[polygonPointIndex];
    const end = polygon.points[(polygonPointIndex + 1) % polygon.points.length];

    const startX = start.x.toMetres();
    const startY = start.y.toMetres();
    const endX = end.x.toMetres();
    const endY = end.y.toMetres();

    if (
      ((pointY <= startY) != (pointY <= endY)) &&
      (pointX < (
        (endX - startX) * (pointY - startY) / (endY - startY) + startX
      ))
    ) {
      result = !result;
    }
  }

  return result;
}
