import { ClientState } from "simple-sync/lib/client";

import { AppState, AppUpdate } from "./app";
import SketcherView from "./SketcherView";

import "./scss/style.scss";

interface AppProps {
  clientState: ClientState<AppState, AppUpdate>;
}

export default function ClientStateView(props: AppProps) {
  const { clientState } = props;

  switch (clientState.type) {
    case "connecting":
      return (
        <p>Connecting...</p>
      );
    case "connected":
      return (
        <SketcherView sendUpdate={clientState.sendAppUpdate} state={clientState.appState} />
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
