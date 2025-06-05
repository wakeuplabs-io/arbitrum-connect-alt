import ReactQueryProvider from "@/hoc/ReactQueryProvider.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Web3Provider from "./hoc/Web3Provider.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </ReactQueryProvider>
  </React.StrictMode>,
);
