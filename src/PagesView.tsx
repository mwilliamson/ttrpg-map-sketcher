import { Button } from "@chakra-ui/react";
import * as uuid from "uuid";

import { AppUpdate, Page } from "./app";
import ItemList from "./widgets/ItemList";

interface PagesViewProps {
  onSelectPage: (pageId: string) => void;
  pages: ReadonlyArray<Page>;
  selectedPageId: string | null;
  sendUpdate: (update: AppUpdate) => void;
}

export default function PagesView(props: PagesViewProps) {
  const { onSelectPage, pages, selectedPageId, sendUpdate } = props;

  return (
    <>
      <ItemList>
        {pages.map(page => (
          <ItemList.Item
            key={page.id}
            onDelete={() => sendUpdate({type: "deletePage", id: page.id})}
            isSelected={page.id === selectedPageId}
          >
            <Button
              onClick={() => onSelectPage(page.id)}
              size="sm"
              variant="link"
            >
              {page.name}
            </Button>
          </ItemList.Item>
        ))}
      </ItemList>

      <Button
        marginTop={3}
        onClick={() => sendUpdate({type: "addPage", id: uuid.v4()})}
        size="sm"
        variant="solid"
      >
        Add page
      </Button>
    </>
  );
}
