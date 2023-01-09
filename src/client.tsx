import React from "react";
import ReactDOM from "react-dom/client";
import { useSimpleSync } from "simple-sync/lib/react";

import { applyAppUpdate, initialAppState } from "./app";
import { deserializeAppUpdate, serializeAppUpdate } from "./serialization";
import SketcherView from "./SketcherView";

import "./scss/style.scss";

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

  switch (state.type) {
    case "connecting":
      return (
        <p>Connecting...</p>
      );
    case "connected":
      return (
        <SketcherView sendUpdate={state.sendAppUpdate} state={state.appState} />
      );
    case "connection-error":
      return (
        <p>Connection error, please reload the page.</p>
      );
    case "sync-error":
      return (
        <p>Synchronisation error, please reload the page.</p>
      );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Client />
  </React.StrictMode>,
);
