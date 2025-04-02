import React from 'react';
import { useState, useEffect } from "react";
import EopTool from "./components/EopTool";
import { motion } from "framer-motion";
import "./Index.css";

const Index = () => {
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
            Công cụ hẹn giờ với chế độ tự động
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

export default Index;
