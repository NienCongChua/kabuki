chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    let id = tab.url?.split("?id=")[1];
    chrome.tabs.sendMessage(tab.id!, { id });
  }
});
