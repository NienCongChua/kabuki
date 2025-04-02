import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import "./EopTool.css";
import { TimerState, getTimerState, startTimer, resetTimer, STORAGE_KEY } from "../utils/timerManager";

interface EopToolProps {
  className?: string;
}

const EopTool: React.FC<EopToolProps> = ({ className }) => {
  const [time, setTime] = useState(30);
  const [remainingTime, setRemainingTime] = useState(time);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Khôi phục trạng thái từ localStorage khi component mount
  useEffect(() => {
    const state = getTimerState();
    if (state) {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - state.lastUpdate) / 1000);
      
      setTime(state.time);
      setRemainingTime(Math.max(0, state.remainingTime - elapsedSeconds));
      setIsRunning(state.isRunning);
    } else {
      // Khởi tạo state mặc định nếu chưa có
      const defaultState: TimerState = {
        time: 30,
        remainingTime: 30,
        isRunning: false,
        lastUpdate: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    }
  }, []);

  // Lưu trạng thái vào localStorage khi có thay đổi
  useEffect(() => {
    const state: TimerState = {
      time,
      remainingTime,
      isRunning,
      lastUpdate: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [time, remainingTime, isRunning]);

  // Effect to handle countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            toast({
              title: "Hết giờ!",
              description: "Thời gian đếm ngược đã hết.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, toast]);

  // Reset timer to initial value
  const handleResetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRemainingTime(time);
    setIsRunning(false);
  };

  // Toggle timer running state
  const toggleTimer = () => {
    if (remainingTime === 0) {
      handleResetTimer();
    } else {
      setIsRunning(!isRunning);
    }
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value, 10) || 0;
    setTime(newTime);
    setRemainingTime(newTime);
  };

  return (
    <div className={`eop-card ${className || ""}`}>
      <div className="eop-progress">
        <div 
          className={`eop-progress-bar ${isRunning ? "animate" : ""}`}
          style={{ width: `${(remainingTime / time) * 100}%` }}
        />
      </div>
      
      <div className="eop-content">
        {/* Timer Display */}
        <div className="eop-timer fadeIn">
          <h2 className={`eop-timer-text ${isRunning ? "animate" : ""}`}>
            {remainingTime} giây
          </h2>
        </div>
        
        {/* Controls */}
        <div className="eop-control-group fadeIn">
          <div className="eop-label-group">
            <label className="eop-label">
              <span>Trạng thái:</span>
            </label>
            <div className={`eop-status ${isRunning ? "running" : "paused"}`}>
              <span>
                {isRunning ? "Đang chạy" : "Tạm dừng"}
              </span>
            </div>
          </div>
          
          <div className="eop-label-group">
            <label className="eop-label" htmlFor="time-input">
              <span>Độ trễ (giây):</span>
            </label>
            <input
              ref={inputRef}
              id="time-input"
              type="number"
              min={1}
              max={3600}
              value={time}
              onChange={handleTimeChange}
              className="eop-input"
              disabled={isRunning}
            />
          </div>
        </div>
        
        {/* Single Button for Start/Stop */}
        <div className="eop-button-container">
          <button 
            onClick={toggleTimer}
            className={`eop-button ${isRunning ? "running" : "paused"}`}
            aria-label={isRunning ? "Dừng lại" : "Bắt đầu"}
          >
            {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EopTool;
