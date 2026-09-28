import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FarmProvider } from "./context/FarmContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FarmProvider>
      <App />
    </FarmProvider>
  </React.StrictMode>
);