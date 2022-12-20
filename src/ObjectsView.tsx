import { AppUpdate, Page, SeededMapObject } from "./app";
import ItemList from "./widgets/ItemList";

interface ObjectsViewProps {
  onHighlightObject: (object: SeededMapObject | null) => void;
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
            sendUpdate({type: "deleteObject", pageId: page.id, id: lineObject.id});
            // TODO: more elegant way of dealing with hovered object?
            onHighlightObject(null);
          }}
          onMouseEnter={() => onHighlightObject(lineObject)}
          onMouseLeave={() => onHighlightObject(null)}
        >
          {lineObject.shape.type} #{lineObject.seed}
        </ItemList.Item>
      ))}
    </ItemList>
  );
}
