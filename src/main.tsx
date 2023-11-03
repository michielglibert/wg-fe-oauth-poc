import React from "react";
import ReactDOM from "react-dom/client";
import MainProvider from "./providers/MainProvider";
import Router from "./routes/Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainProvider>
      <Router />
    </MainProvider>
  </React.StrictMode>
);
