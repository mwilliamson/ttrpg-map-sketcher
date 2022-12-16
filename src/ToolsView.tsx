import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { Tool, ToolContext, allToolTypes } from "./app";

interface ToolsViewProps {
  onChange: (value: Tool) => void;
  onRedo: () => void;
  onUndo: () => void;
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
      </Stack>
      <ButtonGroup colorScheme="blue" variant="outline" orientation="vertical" padding={padding}>
        <Button onClick={onUndo}>
          Undo
        </Button>
        <Button onClick={onRedo}>
          Redo
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
