import { Box, Button } from "@chakra-ui/react";

import { AppUpdate, Page, SeededMapObject } from "./app";

interface PagesViewProps {
  pages: ReadonlyArray<Page>;
}

export default function PagesView(props: PagesViewProps) {
  const { pages } = props;

  return (
    <>
      {pages.map(page => (
        <div
          key={page.id}
          style={{
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>Page {page.id}</div>
        </div>
      ))}
    </>
  );
}
