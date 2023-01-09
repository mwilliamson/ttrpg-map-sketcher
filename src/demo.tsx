import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import { applyAppUpdate, AppState, AppUpdate, initialAppState } from "./app";
import SketcherView from "./SketcherView";

function Client() {
  const [appState, setAppState] = useState<AppState>(initialAppState());

  const sendUpdate = (update: AppUpdate) => {
    setAppState(appState => applyAppUpdate(appState, update));
  };

  return (
    <SketcherView sendUpdate={sendUpdate} state={appState} />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Client />
  </React.StrictMode>,
);
