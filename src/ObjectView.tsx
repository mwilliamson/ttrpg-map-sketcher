import { useState } from "react";
import { AppUpdate, NumberedMapObject, shapeColor, updates } from "./app";
import ColorPicker from "./ColorPicker";
import ObjectLabel from "./ObjectLabel";
import PropertiesTable from "./PropertiesTable";
import Input from "./widgets/Input";

interface ObjectViewProps {
  object: NumberedMapObject;
  onDeselect: () => void;
  pageId: string;
  sendUpdate: (update: AppUpdate) => void;
}

export default function ObjectView(props: ObjectViewProps) {
  const { object, onDeselect, pageId, sendUpdate } = props;

  const color = shapeColor(object.shape);

  const token = object.shape.type === "token" ? object.shape.token : null;

  return (
    <>
      <PropertiesTable>
        <PropertiesTable.Row
          name="Name"
          value={(
            <ObjectLabel object={object} />
          )}
        />
        {token !== null && (
          <PropertiesTable.Row
            name="Text"
            value={(
              <TokenTextView
                onChange={newText => sendUpdate(updates.setTokenText({
                  pageId,
                  objectId: object.id,
                  previousText: token.text,
                  text: newText,
                }))}
                value={token.text}
              />
            )}
          />
        )}
      </PropertiesTable>

      {color !== null && (
        <ColorPicker
          layout="horizontal"
          onChange={(newColor) => sendUpdate(updates.setObjectColor({
            pageId,
            objectId: object.id,
            previousColor: color,
            color: newColor,
          }))}
          value={color}
        />
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

interface TokenTextViewProps {
  onChange: (newValue: string) => void;
  value: string;
}

function TokenTextView(props: TokenTextViewProps) {
  const { onChange, value } = props;

  const [editText, setEditText] = useState<string | null>(null);

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (editText !== null) {
      onChange(editText);
      setEditText(null);
    }
  }

  function handleCancel(event: React.SyntheticEvent) {
    setEditText(null);
  }

  return editText === null ? (
    <div className="flex-container-row">
      <div>{value}</div>
      <button className="ml-md" onClick={() => setEditText(value)}>
        🖉
      </button>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      <div className="flex-container-row">
        <Input onChange={newText => setEditText(newText)} value={editText} maxLength={1} style={{width: 30}} />
        <button className="ml-sm" type="submit">
          ✓
        </button>
        <button className="ml-sm" onClick={handleCancel}>
          ✗
        </button>
      </div>
    </form>
  );
}
