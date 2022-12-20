import { Button } from "@chakra-ui/react";

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

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
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
    </div>
  );
}

ItemList.Item = Item;
