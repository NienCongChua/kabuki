import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button, Switch, Typography, Box, Tab, Tabs } from "@mui/material";
import './popup.css';
import EopTool from './components/EopTool';
import { motion } from "framer-motion";
const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>();
  const [autoMode, setAutoMode] = useState<boolean>(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const handleToggle = () => {
    setAutoMode(!autoMode);
    chrome.runtime.sendMessage({ action: autoMode ? "stop" : "start" });
  };

  return (
    <div className="index-container">
      <div className="index-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="index-title">
            Tool EOP
          </h1>
          <motion.p 
            className="index-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Công cụ hoàn thành bài tập tự động
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <EopTool />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
