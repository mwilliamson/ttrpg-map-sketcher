import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";

import { AppState, AppUpdate, Distance, RenderArea, Scale, Tool, noneTool, createUpdateToUndo, NumberedMapObject, createUpdateToRedo } from "./app";
import { defaultFillColor } from "./app/colors";
import { ToolType } from "./app/tools/base";
import MapView from "./MapView";
import ObjectsView from "./ObjectsView";
import PagesView from "./PagesView";
import ToolsView from "./ToolsView";

import "./scss/style.scss";

const renderArea = RenderArea.from({
  scale: Scale.pixelsPerMetre(20),
  mapWidth: Distance.metres(40),
  mapHeight: Distance.metres(30),
  squareWidth: Distance.metres(2),
});

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
  const [tool, setTool] = useState<Tool>(noneTool);
  const [selectedColor, setSelectedColor] = useState(defaultFillColor);
  const [hoveredObject, setHoveredObject] = useState<NumberedMapObject | null>(null);
  const [undoStack, setUndoStack] = useState<UndoStack>({index: 0, updates: []});

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
      setUndoStack({...undoStack, index: undoStack.index + 1})
      const updateRedo = createUpdateToRedo(state, update);
      sendUpdate(updateRedo);
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
    if (update === null) {
      return;
    }

    const updateUndo = createUpdateToUndo(state, update);
    if (updateUndo !== null) {
      sendUpdate(updateUndo);
      setUndoStack({...undoStack, index: undoStack.index - 1  });
    }
  }

  return (
    <div className="flex-container-row h-100">
      <div className="flex-item-static">
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
              pageId: page.id,
              selectedColor: selectedColor,
              sendUpdate: handleSendUpdate,
              squareWidth: renderArea.squareWidth,
            }}
            highlightObject={hoveredObject}
          />
        )}
      </div>
      <div className="flex-item-static flex-container-column" style={{width: 400}}>
        <div className="flex-item-fill">
          <Tabs defaultIndex={1} display="flex" flexDirection="column" height="100%">
            <TabList>
              <Tab>Pages</Tab>
              <Tab>Objects</Tab>
            </TabList>
            <TabPanels flex="1 1 auto" minHeight={0}>
              <TabPanel height="100%" overflowY="scroll">
                <PagesView
                  onSelectPage={pageId => setSelectedPageId(pageId)}
                  pages={state.pages}
                  selectedPageId={selectedPageId}
                  sendUpdate={handleSendUpdate}
                />
              </TabPanel>
              <TabPanel height="100%" overflowY="scroll">
                {page === null ? (
                  <p>No page selected.</p>
                ) : (
                  <ObjectsView
                    onHighlightObject={setHoveredObject}
                    page={page}
                    sendUpdate={handleSendUpdate}
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        <div className="flex-item-fill">
          <Tabs display="flex" flexDirection="column" height="100%">
            <TabList>
              <Tab>Page</Tab>
            </TabList>
            <TabPanels flex="1 1 auto" minHeight={0}>
              <TabPanel height="100%" overflowY="scroll">
                {page === null ? (
                  <p>No page selected.</p>
                ) : (
                  <p>Name: {page.name}</p>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
