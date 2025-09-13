import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import "./EopTool.css";

interface BackgroundTimerState {
  isRunning: boolean;
  delay: number;
  startTime: number;
  autoMode: boolean;
  remainingTime: number;
  currentTaskId: string | null;
}

interface EopToolProps {
  className?: string;
}

const EopTool: React.FC<EopToolProps> = ({ className }) => {
  const [delay, setDelay] = useState(30);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);

  // Đồng bộ với background script
  useEffect(() => {
    const syncWithBackground = () => {
      if (chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ action: "getState" }, (response) => {
          if (chrome.runtime.lastError) {
            return; // Bỏ qua lỗi khi popup đóng
          }
          if (response?.success && response.state) {
            const state: BackgroundTimerState = response.state;
            setDelay(state.delay);
            setIsAutoMode(state.autoMode);
            setRemainingTime(state.remainingTime);
          }
        });
      }
    };

    // Sync ngay khi mount
    syncWithBackground();

    // Sync định kỳ mỗi 100ms để có countdown mượt
    const syncInterval = setInterval(syncWithBackground, 100);

    return () => clearInterval(syncInterval);
  }, []);

  // Toggle auto mode
  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode;
    const action = newAutoMode ? "start" : "stop";

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        action: action,
        delay: delay
      }, (response) => {
        if (chrome.runtime.lastError) {
          // Silent error handling
        } else if (response?.success) {
          setIsAutoMode(newAutoMode);
          setRemainingTime(newAutoMode ? delay : delay);
        }
      });
    }
  };

  // Handle delay input change
  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDelay = parseInt(e.target.value, 10) || 0;
    setDelay(newDelay);
    setRemainingTime(newDelay);

    if (chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({
        action: "setDelay",
        delay: newDelay
      }, (_response) => {
        if (chrome.runtime.lastError) {
          // Xóa toast error
        }
      });
    }
  };

  // Tính toán progress cho vòng quay
  const progress = delay > 0 ? ((delay - remainingTime) / delay) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`eop-card ${className || ""}`}>
      <div className="eop-progress">
        <div
          className={`eop-progress-bar ${isAutoMode ? "animate" : ""}`}
          style={{ width: `${isAutoMode ? 100 : 0}%` }}
        />
      </div>

      <div className="eop-content">
        {/* Countdown Timer với vòng quay */}
        <div className="eop-timer fadeIn">
          <div className="timer-circle-container">
            <svg className="timer-circle" width="100" height="100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isAutoMode ? "#3b82f6" : "#6b7280"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
                className={isAutoMode ? "animate-pulse" : ""}
              />
            </svg>
            <div className="timer-text">
              <span className={`timer-number ${isAutoMode ? "active" : ""}`}>
                {isAutoMode ? remainingTime : delay}
              </span>
              <span className="timer-unit">s</span>
            </div>
          </div>
          <h3 className={`eop-status-text ${isAutoMode ? "active" : ""}`}>
            {isAutoMode ? "Tự động" : "Tắt tự động"}
          </h3>
        </div>

        {/* Controls */}
        <div className="eop-control-group fadeIn">
          <div className="eop-label-group">
            <label className="eop-label">
              <span>Trạng thái:</span>
            </label>
            <div className={`eop-status ${isAutoMode ? "running" : "paused"}`}>
              <span>
                {isAutoMode ? "Tự động (Đang chạy)" : "Tắt tự động"}
              </span>
            </div>
          </div>

          <div className="eop-label-group">
            <label className="eop-label" htmlFor="delay-input">
              <span>Độ trễ (giây):</span>
            </label>
            <input
              id="delay-input"
              type="number"
              min={1}
              max={3600}
              value={delay}
              onChange={handleDelayChange}
              className="eop-input"
              disabled={isAutoMode}
            />
          </div>
        </div>

        {/* Single Button for Start/Stop */}
        <div className="eop-button-container">
          <button
            onClick={toggleAutoMode}
            className={`eop-button ${isAutoMode ? "running" : "paused"}`}
            aria-label={isAutoMode ? "Tắt tự động" : "Bật tự động"}
          >
            {isAutoMode ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EopTool;
