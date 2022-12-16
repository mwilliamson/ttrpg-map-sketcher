import { Box, Flex } from "@chakra-ui/react";
import { last } from "lodash";
import { useState } from "react";

import { AppState, AppUpdate, Distance, LineObject, RenderArea, Scale, Tool, noneTool, createUpdateToUndo } from "./app";
import MapView from "./MapView";
import ObjectsView from "./ObjectsView";
import ToolsView from "./ToolsView";

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

export default function SketcherView(props: SketcherViewProps) {
  const {state, sendUpdate} = props;

  const [tool, setTool] = useState<Tool>(noneTool);
  const [hoveredObject, setHoveredObject] = useState<LineObject | null>(null);
  const [undoStack, setUndoStack] = useState<Array<AppUpdate>>([]);

  function handleSendUpdate(update: AppUpdate) {
    setUndoStack(undoStack => [...undoStack, update]);
    sendUpdate(update);
  }

  function handleRedo() {

  }

  function handleUndo() {
    if (undoStack.length === 0) {
      return;
    }

    const lastUpdate = last(undoStack);
    if (lastUpdate === undefined) {
      return;
    }

    const updateUndo = createUpdateToUndo(state, lastUpdate);
    if (updateUndo !== null) {
      sendUpdate(updateUndo);
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
  }

  return (
    <Flex flexDirection="row" height="100%">
      <Box flex="0 0 auto" height="100%">
        <ToolsView
          onChange={newTool => setTool(newTool)}
          onRedo={handleRedo}
          onUndo={handleUndo}
          toolContext={{sendUpdate: handleSendUpdate, squareWidth: renderArea.squareWidth}}
          value={tool}
        />
      </Box>
      <Box flex="1 1 0" minWidth={0} height="100%">
        <MapView
          renderArea={renderArea}
          sendUpdate={handleSendUpdate}
          state={state}
          tool={tool}
          onToolChange={newTool => setTool(newTool)}
          highlightObject={hoveredObject}
        />
      </Box>
      <Box flex="0 0 auto" width={400} height="100%">
        <ObjectsView
          onHighlightObject={setHoveredObject}
          sendUpdate={handleSendUpdate}
          state={state}
        />
      </Box>
    </Flex>
  )
}
