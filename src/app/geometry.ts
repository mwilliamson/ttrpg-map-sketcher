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
}

export class Polygon {
  public static from(points: ReadonlyArray<Point>) {
    return new Polygon(points);
  }

  public readonly points: ReadonlyArray<Point>;

  private constructor(points: ReadonlyArray<Point>) {
    this.points = points;
  }
}
