import React from "react";
import ReactDOM from "react-dom/client";
import { useSimpleSync } from "simple-sync/lib/react";
import ClientStateView from "./ClientStateView";

import { applyAppUpdate, initialAppState } from "./app";
import { deserializeAppUpdate, serializeAppUpdate } from "./serialization";

function webSocketUri() {
  const location = window.location;
  const webSocketProtocol = location.protocol === "https:" ? "wss" : "ws";

  let path = new URLSearchParams(location.search).get("path") || "ws";
  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  return `${webSocketProtocol}://${location.host}/${path}`;
}

function Client() {
  const state = useSimpleSync({
    applyAppUpdate,
    initialAppState: initialAppState(),
    uri: webSocketUri(),

    serializeAppUpdate,
    deserializeAppUpdate,
  });

  return (
    <ClientStateView clientState={state} />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Client />
  </React.StrictMode>,
);
