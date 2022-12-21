import classNames from "classnames";

import { allToolTypes } from "./app";
import { fillColors } from "./app/colors";
import { ToolType } from "./app/tools/base";

interface ToolsViewProps {
  onRedo: (() => void) | null;
  onUndo: (() => void) | null;

  selectedToolType: ToolType;
  onSelectToolType: (toolType: ToolType) => void;

  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function ToolsView(props: ToolsViewProps) {
  const { onRedo, onUndo, selectedToolType, onSelectToolType, selectedColor, onSelectColor } = props;

  return (
    <div className="flex-container-column justify-content-space-between h-100" style={{width: 100}}>
      <div>
        <h2 className="my-md text-center">Tools</h2>
        <div className="btn-stack m-sm">
          {allToolTypes.map(toolType => (
            <button
              key={toolType.name}
              className={classNames(
                "btn btn-primary",
                selectedToolType === toolType ? "btn-variant-solid" : "btn-variant-outline",
              )}
              onClick={() => onSelectToolType(toolType)}
            >
              {toolType.name}
            </button>
          ))}
        </div>
        <div className="m-sm" style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5}}>
          <div style={{height: 40, backgroundColor: selectedColor, border: "1px solid #000", gridColumn: "1 / span 3"}}></div>
          {fillColors.map(fillColor => (
            <div
              key={fillColor}
              style={{
                backgroundColor: fillColor,
                aspectRatio: 1,
                border: "1px solid #000",
              }}
              onClick={() => onSelectColor(fillColor)}
            >
            </div>
          ))}
        </div>
      </div>
      <div className="btn-stack m-sm">
        <button
          className="btn btn-primary btn-variant-outline"
          disabled={onUndo === null}
          onClick={onUndo === null ? undefined : onUndo}
        >
          Undo
        </button>
        <button
          className="btn btn-primary btn-variant-outline"
          disabled={onRedo === null}
          onClick={onRedo === null ? undefined : onRedo}
        >
          Redo
        </button>
      </div>
    </div>
  );
}
