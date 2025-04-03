import { STORAGE_KEY } from './utils/timerManager';

// Create alarm for timer update
chrome.alarms.create('updateTimer', {
  periodInMinutes: 1/60 // Run every second
});

// Handle timer update
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'updateTimer') {
    try {
      // Get current timer state
      const result = await chrome.storage.local.get([STORAGE_KEY]);
      const state = result[STORAGE_KEY];

      if (state && state.isRunning) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - state.lastUpdate) / 1000);
        const newRemainingTime = Math.max(0, state.remainingTime - elapsedSeconds);

        // Update timer state
        const newState = {
          ...state,
          remainingTime: newRemainingTime,
          lastUpdate: now
        };

        // If timer reaches 0, stop it
        if (newRemainingTime === 0) {
          newState.isRunning = false;
        }

        await chrome.storage.local.set({ [STORAGE_KEY]: newState });
      }
    } catch (error) {
      console.error('Error updating timer:', error);
    }
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    let id = tab.url?.split("?id=")[1];
    chrome.tabs.sendMessage(tab.id!, { id });
  }
});
