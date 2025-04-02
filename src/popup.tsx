import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  return (
    <>
      <div>Hello world!</div>
      <div>
        <button onClick={() => {
          chrome.runtime.sendMessage({ action: "start" });
        }}>Start</button>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
