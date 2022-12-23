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
      {page.objects.map(object => (
        <ItemList.Item
          key={object.id}
          isSelected={object.id === selectedObjectId}
          onDelete={() => {
            sendUpdate(updates.deleteObject({pageId: page.id, objectId: object.id}));
          }}
          onMouseEnter={() => onHighlightObject(object.id)}
          onMouseLeave={() => onHighlightObject(null)}
          onSelect={() => onSelectObject(object.id)}
        >
          {object.shape.type} #{object.objectNumber}
        </ItemList.Item>
      ))}
    </ItemList>
  );
}
