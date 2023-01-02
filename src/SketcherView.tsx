import { useEffect, useState } from "react";

import { AppState, AppUpdate, Tool, panTool, createUpdateToUndo, createUpdateToRedo, updates } from "./app";
import { defaultFillColor } from "./app/colors";
import { ToolType } from "./app/tools/base";
import { selectToolType } from "./app/tools/select";
import MapView from "./MapView";
import ObjectsView from "./ObjectsView";
import PagesView from "./PagesView";
import ToolsView from "./ToolsView";
import isInputEvent from "./util/isInputEvent";
import Tabs from "./widgets/Tabs";

interface SketcherViewProps {
  sendUpdate: (update: AppUpdate) => void;
  state: AppState;
}

interface UndoStack {
  readonly index: number;
  readonly updates: ReadonlyArray<AppUpdate>;
}

export default function SketcherView(props: SketcherViewProps) {
  const {state, sendUpdate} = props;

  const [selectedPageId, setSelectedPageId] = useState<string | null>(state.pages.length === 0 ? null : state.pages[0].id);
  const [selectedTool, setSelectedTool] = useState<Tool>(panTool);
  const [selectedColor, setSelectedColor] = useState(defaultFillColor);
  const [highlightedObjectId, setHighlightedObjectId] = useState<string | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<UndoStack>({index: 0, updates: []});
  const [selectToolOverride, setSelectToolOverride] = useState<Tool | null>(null);

  const page = selectedPageId === null ? null : state.findPage(selectedPageId);

  const activeTool = selectToolOverride ?? selectedTool;

  function handleActiveToolChange(newTool: Tool) {
    // TODO: there's probably a more elegant way of doing this,
    // for instance, so that when releasing control the selected tool has the right mouse position.
    // Perhaps don't store mouse position in tool state?
    if (selectToolOverride === null) {
      setSelectedTool(newTool);
    } else {
      setSelectToolOverride(newTool);
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isInputEvent(event)) {
        return;
      }

      if (event.key === "Escape") {
        const newTool = activeTool.onEscape === undefined ? null : activeTool.onEscape();
        if (newTool === null) {
          setSelectedObjectId(null);
        } else {
          setSelectedTool(newTool);
        }
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        if (page !== null && selectedObjectId !== null && page.hasObjectId(selectedObjectId)) {
          sendUpdate(updates.deleteObject({pageId: page.id, objectId: selectedObjectId}));
        }
      }

      if (event.key === "Control") {
        setSelectToolOverride(selectToolType.create());
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "Control") {
        setSelectToolOverride(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [page, selectedObjectId, sendUpdate, activeTool]);

  function handleSelectToolType(newToolType: ToolType) {
    if (newToolType === selectedTool.type) {
      return;
    }
    const newTool = newToolType.create();
    setSelectedTool(newTool);
  }

  function handleSelectColor(newColor: string) {
    setSelectedColor(newColor);
  }

  function handleSendUpdate(update: AppUpdate) {
    setUndoStack(undoStack => ({
      index: undoStack.index + 1,
      updates: [...undoStack.updates.slice(0, undoStack.index), update],
    }));
    sendUpdate(update);
  }

  function updateToRedo() {
    if (undoStack.index < undoStack.updates.length) {
      return undoStack.updates[undoStack.index];
    } else {
      return null;
    }
  }

  function handleRedo() {
    const update = updateToRedo();
    if (update !== null) {
      const updateRedo = createUpdateToRedo(state, update);
      sendUpdate(updateRedo);
      setUndoStack({...undoStack, index: undoStack.index + 1});
    }
  }

  function updateToUndo() {
    if (undoStack.index === 0) {
      return null;
    } else {
      return undoStack.updates[undoStack.index - 1];
    }
  }

  function handleUndo() {
    const update = updateToUndo();
    if (update !== null) {
      const updateUndo = createUpdateToUndo(state, update);
      sendUpdate(updateUndo);
      setUndoStack({...undoStack, index: undoStack.index - 1  });
    }
  }

  return (
    <div className="flex-container-row h-100">
      <div className="flex-item-static mr-md">
        <ToolsView
          onRedo={updateToRedo() === null ? null : handleRedo}
          onUndo={updateToUndo() === null ? null : handleUndo}

          selectedToolType={selectedTool.type}
          onSelectToolType={newToolType => handleSelectToolType(newToolType)}

          selectedColor={selectedColor}
          onSelectColor={newColor => handleSelectColor(newColor)}
        />
      </div>
      <div className="flex-item-fill">
        {page !== null && (
          <MapView
            page={page}
            sendUpdate={handleSendUpdate}
            tool={activeTool}
            onToolChange={newTool => handleActiveToolChange(newTool)}
            highlightedObjectId={highlightedObjectId ?? selectedObjectId}
            onSelectObject={newSelectedObjectId => setSelectedObjectId(newSelectedObjectId)}
            selectedColor={selectedColor}
            selectedObjectId={selectedObjectId}
          />
        )}
      </div>
      <div className="flex-item-static ml-md" style={{width: 270}}>
        <Tabs.Flex
          defaultIndex={1}
          tabs={[
            {
              title: "Pages",
              render: () => (
                <PagesView
                  className="h-100"
                  onSelectPage={pageId => setSelectedPageId(pageId)}
                  pages={state.pages}
                  selectedPageId={selectedPageId}
                  sendUpdate={handleSendUpdate}
                />
              )
            },
            {
              title: "Objects",
              render: () => page === null ? (
                <p>No page selected.</p>
              ) : (
                <ObjectsView
                  className="h-100"
                  onHighlightObject={objectId => setHighlightedObjectId(objectId)}
                  onSelectObject={objectId => setSelectedObjectId(objectId)}
                  page={page}
                  selectedObjectId={selectedObjectId}
                  sendUpdate={handleSendUpdate}
                />
              )
            },
          ]}
        />
      </div>
    </div>
  );
}
