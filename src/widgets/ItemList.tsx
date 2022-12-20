import { Button, Flex } from "@chakra-ui/react";

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
  onDelete?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function Item(props: ItemProps) {
  const {children, onDelete, onMouseEnter, onMouseLeave} = props;

  const borderWidth = 1;

  return (
    <Flex
      borderWidth={borderWidth}
      borderTopWidth={0}
      _first={{borderTopWidth: 1}}
      borderColor="gray.400"
      direction="row"
      justifyContent="space-between"
      paddingX={3}
      paddingY={1}
      fontSize="sm"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div>
        {children}
      </div>
      {onDelete !== null && (
        <Button
          onClick={onDelete}
          size="sm"
          variant="link"
        >
          Delete
        </Button>
      )}
    </Flex>
  );
}

ItemList.Item = Item;
