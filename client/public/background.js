let activeTabId = null;
let activeTabUrl = null; // Hostname of the active tab
let lastTick = Date.now();
let tabUsage = {}; // Accumulates usage per site
// todo: const?

// Record elapsed time for the current active tab
function recordUsage() {
  const now = Date.now();
  const elapsed = now - lastTick;
  lastTick = now;
  if (activeTabId !== null && activeTabUrl) {
    tabUsage[activeTabUrl] = (tabUsage[activeTabUrl] || 0) + elapsed;
    console.log(`Tick: logged ${elapsed} ms for ${activeTabUrl}`);
  }
}

// Update the active tab and record any pending time from the previous tab
function updateActiveTab(newTabId) {
  // Record any usage from the previous active tab
  recordUsage();
  activeTabId = newTabId;
  if (newTabId !== null) {
    // todo: check .get / log chrome.tabs
    chrome.tabs.get(newTabId, (tab) => { // todo: remove braces
      if (chrome.runtime.lastError || !tab || !tab.url) {
        activeTabUrl = null;
      } else {
        activeTabUrl = new URL(tab.url).hostname;
        // todo: log (tab.url, new URL and .hostname)
        console.log(`Switched to tab ${newTabId}: ${activeTabUrl}`);
      }
    });
  } else {
    activeTabUrl = null; // todo: merge with first  =null assignment?
    console.log("No active tab");
  }
}

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateActiveTab(activeInfo.tabId);
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateActiveTab(null); // Browser lost focus
  } else {
    // todo: check tabs.query
    chrome.tabs.query({ active: true, windowId }, (tabs) => {
      if (tabs.length > 0) { // todo: works without condition?
        updateActiveTab(tabs[0].id);
      }
    });
  }
});


// Listen for url changes within the active tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    // Record time for the previous url, then update to the new one
    recordUsage();
    activeTabUrl = new URL(changeInfo.url).hostname;
    console.log(`Tab ${tabId} updated URL to: ${activeTabUrl}`);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    updateActiveTab(null);
  }
});

// todo: remove cause unnec.
//record usage every second
setInterval(recordUsage, 1000);

// Send usage data every 30 seconds
setInterval(() => {
  //Capture the latest time before sending
  recordUsage();
  if (Object.keys(tabUsage).length > 0) {
    const usageData = Object.entries(tabUsage).map(([site, timespent]) => ({
      site,
      timespent,
    })); // todo: remove unnec. braces around argument
    console.log("Sending tabUsage:", usageData);
    fetch("http://localhost:3000/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usage: usageData }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to send data");
        return response.json();
      })
      .then(() => {
        tabUsage = {}; // Clear usage if request succeeds
      })
      .catch((error) => {
        console.error("Error sending usage data:", error);
      });
  }
}, 30000);

console.log("background tab tracking script is running");
