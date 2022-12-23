import classNames from "classnames";

import "./ItemList.scss";

interface ItemListProps {
  children: React.ReactNode;
}

export default function ItemList(props: ItemListProps) {
  const {children} = props;

  return (
    <div className="widgets-ItemList">
      {children}
    </div>
  );
}

interface ItemProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onDelete?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onSelect?: () => void;
}

function Item(props: ItemProps) {
  const {children, isSelected = false, onDelete, onMouseEnter, onMouseLeave, onSelect} = props;

  return (
    <div
      className="widgets-ItemList_Item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={classNames(
          "widgets-ItemList_selection-status",
          {"widgets-ItemList_selection-status--selected": isSelected},
        )}
      >
      </div>
      <div
        className="widgets-ItemList_contents"
      >
        <div>
          {onSelect === undefined ? children : (
            <button onClick={onSelect}>
              {children}
            </button>
          )}
        </div>
        {onDelete !== undefined && (
          <button
            className="widgets-ItemList_delete"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

ItemList.Item = Item;
