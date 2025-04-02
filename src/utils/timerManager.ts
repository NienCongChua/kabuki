export interface TimerState {
  time: number;
  remainingTime: number;
  isRunning: boolean;
  lastUpdate: number;
}

export const STORAGE_KEY = 'eop_timer_state';

export const getTimerState = (): TimerState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    console.log('Raw saved state:', savedState);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      console.log('Parsed state:', parsedState);
      return parsedState;
    }
    console.log('No saved state found');
    return null;
  } catch (error) {
    console.error('Error getting timer state:', error);
    return null;
  }
};

export const startTimer = () => {
  const state = getTimerState();
  if (state) {
    const newState: TimerState = {
      ...state,
      isRunning: true,
      lastUpdate: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }
};

export const resetTimer = () => {
  const state = getTimerState();
  if (state) {
    const newState: TimerState = {
      ...state,
      remainingTime: state.time,
      lastUpdate: Date.now(),
      isRunning: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }
};

export const checkAndHandleTimer = () => {
  const state = getTimerState();
  console.log("state: ", state);
  console.log("state.isRunning: ", state?.isRunning);
  console.log("state.remainingTime: ", state?.remainingTime);
  console.log("state.lastUpdate: ", state?.lastUpdate);
  if (state && state.isRunning) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastUpdate) / 1000);
    const newRemainingTime = Math.max(0, state.remainingTime - elapsedSeconds);
    console.log("Thời gian còn lại:", newRemainingTime);
    
    if (newRemainingTime === 0) {
      resetTimer();
      return true;
    }
  }
  return false;
}; 