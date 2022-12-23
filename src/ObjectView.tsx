import { AppUpdate, NumberedMapObject } from "./app";
import ObjectLabel from "./ObjectLabel";
import PropertiesTable from "./PropertiesTable";

interface ObjectViewProps {
  object: NumberedMapObject;
  onDeselect: () => void;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectView(props: ObjectViewProps) {
  const { object, onDeselect } = props;

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
    </>
  );
}
