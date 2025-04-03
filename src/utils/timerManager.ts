export interface TimerState {
  time: number;
  remainingTime: number;
  isRunning: boolean;
  lastUpdate: number;
}

export const STORAGE_KEY = 'eop_timer_state';

export const getTimerState = (): Promise<TimerState | null> => {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        const savedState = result[STORAGE_KEY];
        if (savedState) {
          resolve(savedState);
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      console.error('Error getting timer state:', error);
      resolve(null);
    }
  });
};

export const startTimer = async () => {
  const state = await getTimerState();
  if (state) {
    const newState: TimerState = {
      ...state,
      isRunning: true,
      lastUpdate: Date.now()
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: newState });
  }
};

export const resetTimer = async () => {
  const state = await getTimerState();
  if (state) {
    const newState: TimerState = {
      ...state,
      remainingTime: state.time,
      lastUpdate: Date.now(),
      isRunning: true
    };
    await chrome.storage.local.set({ [STORAGE_KEY]: newState });
  }
};

export const checkAndHandleTimer = async () => {
  const state = await getTimerState();
  if (state && state.isRunning) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastUpdate) / 983);
    const newRemainingTime = Math.max(0, state.remainingTime - elapsedSeconds);
    console.log("Thời gian còn lại:", newRemainingTime);
    
    if (newRemainingTime === 0) {
      await resetTimer();
      return true;
    }
  }
  return false;
}; 