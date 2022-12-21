import { AppUpdate, Page, NumberedMapObject, updates } from "./app";
import ItemList from "./widgets/ItemList";

interface ObjectsViewProps {
  onHighlightObject: (object: NumberedMapObject | null) => void;
  page: Page;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectsView(props: ObjectsViewProps) {
  const { onHighlightObject, page, sendUpdate } = props;

  return (
    <ItemList>
      {page.objects.map(lineObject => (
        <ItemList.Item
          key={lineObject.id}
          onDelete={() => {
            sendUpdate(updates.deleteObject({pageId: page.id, objectId: lineObject.id}));
            // TODO: more elegant way of dealing with hovered object?
            onHighlightObject(null);
          }}
          onMouseEnter={() => onHighlightObject(lineObject)}
          onMouseLeave={() => onHighlightObject(null)}
        >
          {lineObject.shape.type} #{lineObject.objectNumber}
        </ItemList.Item>
      ))}
    </ItemList>
  );
}
