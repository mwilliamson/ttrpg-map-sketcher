import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { Tool, ToolContext, allToolTypes } from "./app";
import { fillColors } from "./app/colors";

interface ToolsViewProps {
  onChange: (value: Tool) => void;
  onRedo: (() => void) | null;
  onUndo: (() => void) | null;
  toolContext: ToolContext;
  value: Tool;
}

export default function ToolsView(props: ToolsViewProps) {
  const { onChange, onRedo, onUndo, toolContext, value } = props;

  const padding = 1;

  return (
    <Flex flexDirection="column" width={100} height="100%" justifyContent="space-between">
      <Stack padding={padding}>
        <Heading size="md" textAlign="center">Tools</Heading>
        {allToolTypes.map(toolType => (
          <Button
            key={toolType.name}
            colorScheme="blue"
            onClick={() => onChange(toolType.create(toolContext))}
            variant={value.type === toolType ? "solid" : "outline"}
          >
            {toolType.name}
          </Button>
        ))}
        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5}}>
          {fillColors.map(fillColor => (
            <div
              key={fillColor}
              style={{
                backgroundColor: fillColor,
                aspectRatio: 1,
                border: "1px solid #000",
              }}
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
