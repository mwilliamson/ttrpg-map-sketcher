import { RenderArea } from "..";
import { draftColor, highlightColor } from "../colors";
import { Cross, Distance, Line, Point } from "../geometry";
import { RoughLine } from "../rough";

interface CrossViewProps {
  cross: Cross;
  renderArea: RenderArea;
  seed: number;
}

export function CrossView(props: CrossViewProps) {
  const { cross, renderArea, seed } = props;

  return (
    <g>
      {crossLines(cross.center, renderArea).map((crossLine, crossLineIndex) => (
        <RoughLine
          key={crossLineIndex}
          x1={renderArea.toPixelCoordinate(crossLine.start.x)}
          y1={renderArea.toPixelCoordinate(crossLine.start.y)}
          x2={renderArea.toPixelCoordinate(crossLine.end.x)}
          y2={renderArea.toPixelCoordinate(crossLine.end.y)}
          seed={seed}
          strokeColor={cross.color}
          strokeWidth={crossStrokeWidth}
        />
      ))}
    </g>
  );
}

interface CrossHighlightViewProps {
  cross: Cross;
  renderArea: RenderArea;
}

export function CrossHighlightView(props: CrossHighlightViewProps) {
  const { cross, renderArea } = props;

  return (
    <>
      {crossLines(cross.center, renderArea).map((crossLine, crossLineIndex) => (
        <line
          key={crossLineIndex}
          stroke={highlightColor}
          strokeWidth={crossStrokeWidth * 5}
          x1={renderArea.toPixelCoordinate(crossLine.start.x)}
          y1={renderArea.toPixelCoordinate(crossLine.start.y)}
          x2={renderArea.toPixelCoordinate(crossLine.end.x)}
          y2={renderArea.toPixelCoordinate(crossLine.end.y)}
        />
      ))}
    </>
  );
}

interface CrossDraftViewProps {
  center: Point;
  renderArea: RenderArea;
}

export function CrossDraftView(props: CrossDraftViewProps) {
  const { center, renderArea } = props;

  return (
    <g stroke={draftColor} strokeWidth={3} strokeLinecap="round">
      {crossLines(center, renderArea).map((line, crossLineIndex) => (
        <line
          key={crossLineIndex}
          x1={renderArea.toPixelCoordinate(line.start.x)}
          y1={renderArea.toPixelCoordinate(line.start.y)}
          x2={renderArea.toPixelCoordinate(line.end.x)}
          y2={renderArea.toPixelCoordinate(line.end.y)}
        />
      ))}
    </g>
  );
}

function crossLines(center: Point, renderArea: RenderArea): ReadonlyArray<Line> {
  const halfWidth = crossWidth(renderArea).divide(2);

  return [
    Line.from(
      Point.from(
        center.x.subtract(halfWidth),
        center.y.subtract(halfWidth),
      ),
      Point.from(
        center.x.add(halfWidth),
        center.y.add(halfWidth),
      ),
    ),
    Line.from(
      Point.from(
        center.x.subtract(halfWidth),
        center.y.add(halfWidth),
      ),
      Point.from(
        center.x.add(halfWidth),
        center.y.subtract(halfWidth),
      ),
    ),
  ];
}

export function crossWidth({squareWidth}: {squareWidth: Distance}): Distance {
  return squareWidth;
}

const crossStrokeWidth = 3;
