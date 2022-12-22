import { RenderArea } from ".";
import { draftColor, highlightColor } from "../colors";
import { Line, Point } from "../geometry";
import { RoughLine } from "../rough";

interface LineViewProps {
  line: Line;
  renderArea: RenderArea;
  seed: number;
}

export function LineView(props: LineViewProps) {
  const { line, renderArea, seed } = props;

  return (
    <RoughLine
      x1={renderArea.toPixelCoordinate(line.start.x)}
      y1={renderArea.toPixelCoordinate(line.start.y)}
      x2={renderArea.toPixelCoordinate(line.end.x)}
      y2={renderArea.toPixelCoordinate(line.end.y)}
      seed={seed}
    />
  );
}

interface LineHighlightViewProps {
  line: Line;
  renderArea: RenderArea;
}

export function LineHighlightView(props: LineHighlightViewProps) {
  const { line, renderArea } = props;

  return (
    <line
      stroke={highlightColor}
      strokeWidth={5}
      x1={renderArea.toPixelCoordinate(line.start.x)}
      y1={renderArea.toPixelCoordinate(line.start.y)}
      x2={renderArea.toPixelCoordinate(line.end.x)}
      y2={renderArea.toPixelCoordinate(line.end.y)}
    />
  );
}

interface LineDraftViewProps {
  start: Point | null;
  end: Point | null;
  renderArea: RenderArea;
}

export function LineDraftView(props: LineDraftViewProps) {
  const { start, end, renderArea } = props;

  return (
    <g>
      {start !== null && (
        <circle cx={renderArea.toPixelCoordinate(start.x)} cy={renderArea.toPixelCoordinate(start.y)} r={5} fill={draftColor} />
      )}
      {end !== null && (
        <circle cx={renderArea.toPixelCoordinate(end.x)} cy={renderArea.toPixelCoordinate(end.y)} r={5} fill={draftColor} />
      )}
      {start !== null && end !== null && (
        <line
          x1={renderArea.toPixelCoordinate(start.x)}
          y1={renderArea.toPixelCoordinate(start.y)}
          x2={renderArea.toPixelCoordinate(end.x)}
          y2={renderArea.toPixelCoordinate(end.y)}
          stroke={draftColor}
        />
      )}
    </g>
  );
}
