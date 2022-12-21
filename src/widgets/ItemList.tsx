import { Box, Button, Flex } from "@chakra-ui/react";

interface ItemListProps {
  children: React.ReactNode;
}

export default function ItemList(props: ItemListProps) {
  const {children} = props;

  return (
    <>
      {children}
    </>
  );
}

interface ItemProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onDelete?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function Item(props: ItemProps) {
  const {children, isSelected = false, onDelete, onMouseEnter, onMouseLeave} = props;

  const borderWidth = 1;

  return (
    <Box
      borderWidth={borderWidth}
      borderTopWidth={0}
      _first={{borderTopWidth: 1}}
      borderColor="gray.400"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Flex
        direction="row"
      >
        <Box backgroundColor={isSelected ? "gray.400" : "transparent"} width={2} />
        <Flex
          flex="1 1 auto"
          direction="row"
          justifyContent="space-between"
          paddingX={2}
          paddingY={1}
          fontSize="sm"
        >
          <div>
            {children}
          </div>
          {onDelete !== undefined && (
            <Button
              colorScheme="red"
              onClick={onDelete}
              size="sm"
              variant="link"
            >
              Delete
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

ItemList.Item = Item;
