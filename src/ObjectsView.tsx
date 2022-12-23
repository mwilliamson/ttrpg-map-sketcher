import classNames from "classnames";

import { AppUpdate, Page, updates } from "./app";
import ObjectLabel from "./ObjectLabel";
import ObjectView from "./ObjectView";
import ItemList from "./widgets/ItemList";

interface ObjectsViewProps {
  className?: string;
  onHighlightObject: (objectId: string | null) => void;
  onSelectObject: (objectId: string | null) => void;
  page: Page;
  selectedObjectId: string | null;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectsView(props: ObjectsViewProps) {
  const { className, onHighlightObject, onSelectObject, page, selectedObjectId, sendUpdate } = props;

  const selectedObject = selectedObjectId === null
    ? null
    : page.objects.find(object => object.id === selectedObjectId) ?? null;

  return (
    <div className={classNames("flex-container-column", className)}>
      <div className="flex-item-fill overflow-y-auto">
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
              <ObjectLabel object={object} />
            </ItemList.Item>
          ))}
        </ItemList>
      </div>

      <div className="flex-item-fill overflow-y-auto mt-md">
        <h2 className="heading-section">Object</h2>

        {selectedObject === null ? (
          <p>No object selected.</p>
        ) : (
          <ObjectView
            object={selectedObject}
            onDeselect={() => onSelectObject(null)}
            pageId={page.id}
            sendUpdate={sendUpdate}
          />
        )}
      </div>
    </div>
  );
}
