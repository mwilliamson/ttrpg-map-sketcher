import { AppUpdate, NumberedMapObject, shapeColor, updates } from "./app";
import ColorPicker from "./ColorPicker";
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

  const color = shapeColor(object.shape);

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

      {color !== null && (
        <div style={{width: 90}}>
          <ColorPicker
            onChange={(newColor) => sendUpdate(updates.setObjectColor({
              pageId,
              objectId: object.id,
              previousColor: color,
              color: newColor,
            }))}
            value={color}
          />
        </div>
      )}

      <button
        className="btn btn-secondary btn-variant-solid btn-sm mt-md"
        onClick={() => onDeselect()}
      >
          Deselect
      </button>
      <button
        className="btn btn-danger btn-variant-solid btn-sm mt-md ml-md"
        onClick={() => sendUpdate(updates.deleteObject({pageId, objectId: object.id}))}
      >
          Delete
      </button>
    </>
  );
}
