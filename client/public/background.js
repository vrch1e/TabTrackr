let activeTabId = null;
let tabStartTime = null;
let tabUsage = {}; //sent to db & cleared every 10 secs

// updates the tabUsage object with the time spent on the active tab
function updateTabUsage(tabId) {
    console.log('updateTabUsage has been called with: ', tabId)

    if (activeTabId !== null && tabStartTime !== null) {
        const timeSpent = Date.now() - tabStartTime

        chrome.tabs.get(activeTabId, (tab) => {
        if (chrome.runtime.lastError || !tab || !tab.url) return;

        const site = new URL(tab.url).hostname
        tabUsage[site] = (tabUsage[site] || 0) + timeSpent
        });
    }
    
    // after first interval, these will be updated so tabUsage can be filled
    activeTabId = tabId; 
    tabStartTime = Date.now();
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    updateTabUsage(activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {   // lines 28 to 38 is ai code. Used to account for if the user switches windows
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        updateTabUsage(null);
    } else {
        chrome.tabs.query({ active: true, windowId }, (tabs) => {
        if (tabs.length > 0) {
            updateTabUsage(tabs[0].id);
        }
    });
  }
});

//send usage data to db every 10 seconds - maybe this is too often? I'm not sure how taxing this operation is on performance
setInterval(() => {
  if (Object.keys(tabUsage).length > 0) {
    const usageData = Object.entries(tabUsage).map(([site, timespent]) => ({
      site,
      timespent,
    }));

    console.log("Sending tabUsage:", tabUsage);

    fetch("http://localhost:3000/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usage: usageData }),
    })
      .then(() => {
        tabUsage = {};
      })
      .catch((error) => {
        console.error("Error sending usage data:", error);
      });
  }
}, 10000);

console.log("Background script is running");