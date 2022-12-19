import { RenderArea } from ".";
import { draftColor, highlightColor } from "../colors";
import { Distance, Point, Token } from "../geometry";

interface TokenViewProps {
  renderArea: RenderArea;
  token: Token;
}

export function TokenView(props: TokenViewProps) {
  const { renderArea, token } = props;

  return (
    <circle
      stroke="#000"
      strokeWidth="3"
      fill={token.color}
      cx={renderArea.toPixelCoordinate(token.center.x)}
      cy={renderArea.toPixelCoordinate(token.center.y)}
      r={renderArea.distanceToPixels(tokenRadius(renderArea))}
    />
  )
}

interface TokenHighlightViewProps {
  renderArea: RenderArea;
  token: Token;
}

export function TokenHighlightView(props: TokenHighlightViewProps) {
  const { renderArea, token } = props;

  return (
    <circle
      fill={highlightColor}
      cx={renderArea.toPixelCoordinate(token.center.x)}
      cy={renderArea.toPixelCoordinate(token.center.y)}
      r={renderArea.distanceToPixels(tokenRadius(renderArea).multiply(1.5))}
    />
  );
}

interface TokenDraftViewProps {
  center: Point;
  renderArea: RenderArea;
}

export function TokenDraftView(props: TokenDraftViewProps) {
  const { center, renderArea } = props;

  return (
    <circle
      fill={draftColor}
      cx={renderArea.toPixelCoordinate(center.x)}
      cy={renderArea.toPixelCoordinate(center.y)}
      r={renderArea.distanceToPixels(tokenRadius(renderArea))}
    />
  );
}

function tokenRadius(renderArea: RenderArea): Distance {
  return renderArea.squareWidth.divide(2);
}
