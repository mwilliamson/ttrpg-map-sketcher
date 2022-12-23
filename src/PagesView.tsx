import classNames from "classnames";

import { AppUpdate, Page, updates } from "./app";
import PageView from "./PageView";
import ItemList from "./widgets/ItemList";

interface PagesViewProps {
  className?: string;
  onSelectPage: (pageId: string) => void;
  pages: ReadonlyArray<Page>;
  selectedPageId: string | null;
  sendUpdate: (update: AppUpdate) => void;
}

export default function PagesView(props: PagesViewProps) {
  const { className, onSelectPage, pages, selectedPageId, sendUpdate } = props;

  const selectedPage = selectedPageId === null
    ? null
    : pages.find(page => page.id === selectedPageId) ?? null;

  return (
    <div className={classNames("flex-container-column", className)}>
      <div className="flex-item-fill overflow-y-auto">
        <ItemList>
          {pages.map(page => (
            <ItemList.Item
              key={page.id}
              onDelete={() => sendUpdate(updates.deletePage({pageId: page.id}))}
              onSelect={() => onSelectPage(page.id)}
              isSelected={page.id === selectedPageId}
            >
              {page.name}
            </ItemList.Item>
          ))}
        </ItemList>

        <button
          className="btn btn-secondary btn-variant-solid btn-sm mt-md"
          onClick={() => sendUpdate(updates.addPage())}
        >
          Add page
        </button>
      </div>

      <div className="flex-item-fill overflow-y-auto mt-md">
        <h2 className="heading-section">Page</h2>

        {selectedPage === null ? (
          <p>No page selected.</p>
        ) : (
          <PageView page={selectedPage} sendUpdate={sendUpdate} />
        )}
      </div>
    </div>
  );
}
