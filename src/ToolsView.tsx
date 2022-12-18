import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { Tool, allToolTypes } from "./app";
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

  const padding = 1;

  return (
    <Flex flexDirection="column" width={100} height="100%" justifyContent="space-between">
      <Stack padding={padding}>
        <Heading size="md" textAlign="center">Tools</Heading>
        {allToolTypes.map(toolType => (
          <Button
            key={toolType.name}
            colorScheme="blue"
            onClick={() => onSelectToolType(toolType)}
            variant={selectedToolType === toolType ? "solid" : "outline"}
          >
            {toolType.name}
          </Button>
        ))}
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5}}>
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
      </Stack>
      <ButtonGroup colorScheme="blue" variant="outline" orientation="vertical" padding={padding}>
        <Button disabled={onUndo === null} onClick={onUndo === null ? undefined : onUndo}>
          Undo
        </Button>
        <Button disabled={onRedo === null} onClick={onRedo === null ? undefined : onRedo}>
          Redo
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
