import { AppUpdate, NumberedMapObject, updates } from "./app";
import ObjectLabel from "./ObjectLabel";
import PropertiesTable from "./PropertiesTable";

interface ObjectViewProps {
  object: NumberedMapObject;
  onDeselect: () => void;
  pageId: string;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectView(props: ObjectViewProps) {
  const { object, onDeselect, pageId, sendUpdate } = props;

  return (
    <>
      <PropertiesTable>
        <PropertiesTable.Row
          name="Name"
          value={(
            <ObjectLabel object={object} />
          )}
        />
      </PropertiesTable>

      <button
        className="btn btn-secondary btn-variant-solid btn-sm mt-md"
        onClick={() => onDeselect()}
      >
          Deselect
      </button>
      <button
        className="btn btn-danger btn-variant-solid btn-sm mt-md ml-md"
        onClick={() => sendUpdate(updates.deleteObject({pageId: pageId, objectId: object.id}))}
      >
          Delete
      </button>
    </>
  );
}
