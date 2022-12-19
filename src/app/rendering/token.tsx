import { RenderArea } from ".";
import { Distance, Token } from "../geometry";

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
      stroke="#000"
      strokeWidth="3"
      fill={token.color}
      cx={renderArea.toPixelCoordinate(token.center.x)}
      cy={renderArea.toPixelCoordinate(token.center.y)}
      r={renderArea.distanceToPixels(tokenRadius(renderArea))}
    />
  );
}

export function tokenRadius(renderArea: RenderArea): Distance {
  return renderArea.squareWidth.divide(2);
}
