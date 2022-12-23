import { AppUpdate, Page, NumberedMapObject, updates } from "./app";
import ItemList from "./widgets/ItemList";

interface ObjectsViewProps {
  onHighlightObject: (objectId: string | null) => void;
  onSelectObject: (objectId: string | null) => void;
  page: Page;
  selectedObjectId: string | null;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectsView(props: ObjectsViewProps) {
  const { onHighlightObject, onSelectObject, page, selectedObjectId, sendUpdate } = props;

  return (
    <ItemList>
      {page.objects.map(lineObject => (
        <ItemList.Item
          key={lineObject.id}
          isSelected={lineObject.id === selectedObjectId}
          onDelete={() => {
            sendUpdate(updates.deleteObject({pageId: page.id, objectId: lineObject.id}));
            // TODO: more elegant way of dealing with hovered object?
            onHighlightObject(null);
          }}
          onMouseEnter={() => onHighlightObject(lineObject.id)}
          onMouseLeave={() => onHighlightObject(null)}
          onSelect={() => onSelectObject(lineObject.id)}
        >
          {lineObject.shape.type} #{lineObject.objectNumber}
        </ItemList.Item>
      ))}
    </ItemList>
  );
}
