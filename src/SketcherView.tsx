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

interface UndoStack {
  readonly index: number;
  readonly updates: ReadonlyArray<AppUpdate>;
}

export default function SketcherView(props: SketcherViewProps) {
  const {state, sendUpdate} = props;

  const [tool, setTool] = useState<Tool>(noneTool);
  const [hoveredObject, setHoveredObject] = useState<LineObject | null>(null);
  const [undoStack, setUndoStack] = useState<UndoStack>({index: 0, updates: []});

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
      sendUpdate(update);
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
    <Flex flexDirection="row" height="100%">
      <Box flex="0 0 auto" height="100%">
        <ToolsView
          onChange={newTool => setTool(newTool)}
          onRedo={updateToRedo() === null ? null : handleRedo}
          onUndo={updateToUndo() === null ? null : handleUndo}
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
