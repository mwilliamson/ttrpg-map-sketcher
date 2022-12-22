import { useState } from "react";

import { AppState, AppUpdate, Distance, RenderArea, Scale, Tool, panTool, createUpdateToUndo, NumberedMapObject, createUpdateToRedo, PageDimensions } from "./app";
import { defaultFillColor } from "./app/colors";
import { ToolType } from "./app/tools/base";
import MapView from "./MapView";
import ObjectsView from "./ObjectsView";
import PagesView from "./PagesView";
import PageView from "./PageView";
import ToolsView from "./ToolsView";
import Tabs from "./widgets/Tabs";

const zoomLevels = {
  min: -5,
  max: 5,
  default: 0,
};

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
  const [tool, setTool] = useState<Tool>(panTool);
  const [selectedColor, setSelectedColor] = useState(defaultFillColor);
  const [hoveredObject, setHoveredObject] = useState<NumberedMapObject | null>(null);
  const [undoStack, setUndoStack] = useState<UndoStack>({index: 0, updates: []});
  const [zoomLevel, setZoomLevel] = useState(zoomLevels.default);

  function handleZoomChange(zoomDelta: number) {
    setZoomLevel(zoomLevel => clamp(zoomLevels.min, zoomLevel + zoomDelta / 100, zoomLevels.max));
  }

  function clamp(min: number, value: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  const renderArea = RenderArea.from({
    pageDimensions: PageDimensions.from({
      scale: Scale.pixelsPerMetre(20),
      width: Distance.metres(40),
      height: Distance.metres(30),
      squareWidth: Distance.metres(2),
    }),
    zoomLevel,
  });

  const page = selectedPageId === null ? null : state.findPage(selectedPageId);

  function handleSelectToolType(newToolType: ToolType) {
    if (newToolType === tool.type) {
      return;
    }
    const newTool = newToolType.create();
    setTool(newTool);
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
      setUndoStack({...undoStack, index: undoStack.index + 1})
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

          selectedToolType={tool.type}
          onSelectToolType={newToolType => handleSelectToolType(newToolType)}

          selectedColor={selectedColor}
          onSelectColor={newColor => handleSelectColor(newColor)}
        />
      </div>
      <div className="flex-item-fill">
        {page !== null && (
          <MapView
            page={page}
            renderArea={renderArea}
            sendUpdate={handleSendUpdate}
            tool={tool}
            onToolChange={newTool => setTool(newTool)}
            toolContext={{
              objects: page.objects,
              pageId: page.id,
              selectedColor: selectedColor,
              sendUpdate: handleSendUpdate,
              squareWidth: renderArea.squareWidth,
            }}
            highlightObject={hoveredObject}
            onZoomChange={handleZoomChange}
          />
        )}
      </div>
      <div className="flex-item-static flex-container-column ml-md" style={{width: 400}}>
        <Tabs.Flex
          defaultIndex={1}
          tabs={[
            {
              title: "Pages",
              render: () => (
                <PagesView
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
                  onHighlightObject={setHoveredObject}
                  page={page}
                  sendUpdate={handleSendUpdate}
                />
              )
            },
          ]}
        />
        <Tabs.Flex
          tabs={[
            {
              title: "Page",
              render: () => page === null ? (
                <p>No page selected.</p>
              ) : (
                <PageView page={page} sendUpdate={handleSendUpdate} />
              )
            }
          ]}
        />
      </div>
    </div>
  )
}
