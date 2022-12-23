import classNames from "classnames";

import { allToolTypes } from "./app";
import { ToolType } from "./app/tools/base";
import ColorPicker from "./ColorPicker";

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
    <div className="h-100 overflow-y-auto" style={{width: 100}}>
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

      <ColorPicker onChange={onSelectColor} value={selectedColor} />

      <div className="btn-stack m-sm mt-md">
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
