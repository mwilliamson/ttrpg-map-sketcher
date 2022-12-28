import { useId, useState } from "react";

import { AppUpdate, Distance, Page, PageDimensions, updates } from "./app";
import PropertiesTable from "./PropertiesTable";
import FloatInput from "./widgets/FloatInput";
import Input from "./widgets/Input";

interface PageViewProps {
  page: Page;
  sendUpdate: (update: AppUpdate) => void;
}

export default function PageView(props: PageViewProps) {
  const {page, sendUpdate} = props;

  const [isEditing, setIsEditing] = useState(false);

  function handleSave(updates: ReadonlyArray<AppUpdate>) {
    for (const update of updates) {
      sendUpdate(update);
    }

    setIsEditing(false);
  }

  return isEditing ? (
    <PageEditView page={page} onCancel={() => setIsEditing(false)} onSave={handleSave} />
  ) : (
    <PageReadView page={page} onEdit={() => setIsEditing(true)} />
  );
}

interface PageReadViewProps {
  onEdit: () => void;
  page: Page;
}

function PageReadView(props: PageReadViewProps) {
  const {onEdit, page} = props;
  return (
    <>
      <PropertiesTable>
        <PropertiesTable.Row
          name="Name"
          value={page.name}
        />
        <PropertiesTable.Row
          name="Width"
          value={page.dimensions.width.toString()}
        />
        <PropertiesTable.Row
          name="Height"
          value={page.dimensions.height.toString()}
        />
        <PropertiesTable.Row
          name="Square width"
          value={page.dimensions.squareWidth.toString()}
        />
      </PropertiesTable>

      <button
        className="btn btn-secondary btn-variant-solid mt-md"
        onClick={onEdit}
      >
        Edit
      </button>
    </>
  );
}

interface PageEditViewProps {
  onCancel: () => void;
  onSave: (updates: ReadonlyArray<AppUpdate>) => void;
  page: Page;
}

function PageEditView(props: PageEditViewProps) {
  const {onCancel, onSave, page} = props;

  const nameInputId = useId();
  const [name, setName] = useState(page.name);

  const widthInputId = useId();
  const [width, setWidth] = useState(page.dimensions.width.toMetres().toString());

  const heightInputId = useId();
  const [height, setHeight] = useState(page.dimensions.height.toMetres().toString());

  const squareWidthInputId = useId();
  const [squareWidth, setSquareWidth] = useState(page.dimensions.squareWidth.toMetres().toString());

  function handleSave(event: React.SyntheticEvent) {
    event.preventDefault();

    const pageUpdates: Array<AppUpdate> = [];

    if (name !== page.name) {
      pageUpdates.push(updates.renamePage({
        pageId: page.id,
        previousName: page.name,
        name,
      }));
    }

    pageUpdates.push(updates.setPageDimensions({
      pageId: page.id,
      previousDimensions: page.dimensions,
      dimensions: PageDimensions.from({
        width: Distance.metres(parseFloat(width)),
        height: Distance.metres(parseFloat(height)),
        squareWidth: Distance.metres(parseFloat(squareWidth)),
      })
    }));

    onSave(pageUpdates);
  }

  return (
    <form onSubmit={handleSave}>
      <PropertiesTable>
        <PropertiesTable.Row
          name={(
            <label htmlFor={nameInputId}>Name</label>
          )}
          value={(
            <Input className="w-100" id={nameInputId} onChange={newName => setName(newName)} value={name} />
          )}
        />
        <PropertiesTable.Row
          name={(
            <label htmlFor={widthInputId}>Width (m)</label>
          )}
          value={(
            <FloatInput className="w-100" id={widthInputId} onChange={newWidth => setWidth(newWidth)} value={width} />
          )}
        />
        <PropertiesTable.Row
          name={(
            <label htmlFor={heightInputId}>Height (m)</label>
          )}
          value={(
            <FloatInput className="w-100" id={heightInputId} onChange={newHeight => setHeight(newHeight)} value={height} />
          )}
        />
        <PropertiesTable.Row
          name={(
            <label htmlFor={squareWidthInputId}>Square width (m)</label>
          )}
          value={(
            <FloatInput className="w-100" id={squareWidthInputId} onChange={newSquareHeight => setSquareWidth(newSquareHeight)} value={squareWidth} />
          )}
        />
      </PropertiesTable>

      <div className="mt-md">
        <button
          type="submit"
          className="btn btn-primary btn-variant-solid mt-md"
        >
          Save
        </button>
        <button
          className="btn btn-secondary btn-variant-solid mt-md ml-md"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
