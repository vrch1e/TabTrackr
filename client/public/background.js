let activeTabId = null;
let tabStartTime = null;
let tabUsage = {}; //sent to db & cleared every 10 secs

// updates the tabUsage object with the time spent on the active tab
function updateTabUsage(tabId) {
    console.log('updateTabUsage has been called with: ', tabId);

    if (activeTabId !== null && tabStartTime !== null) {
        const timeSpent = Date.now() - tabStartTime;

        chrome.tabs.get(activeTabId, (tab) => {
            if (chrome.runtime.lastError || !tab || !tab.url) return;

            const site = new URL(tab.url).hostname;
            tabUsage[site] = (tabUsage[site] || 0) + timeSpent;

            // Update only after the previous tab's data is saved
            activeTabId = tabId;
            tabStartTime = Date.now();
        });
    } else {
        activeTabId = tabId;
        tabStartTime = Date.now();
    }
}


chrome.tabs.onActivated.addListener((activeInfo) => {
    updateTabUsage(activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        updateTabUsage(null); // Only stop tracking when NO windows are active
    } else {
        chrome.tabs.query({ active: true, windowId }, (tabs) => {
            if (tabs.length > 0) {
                updateTabUsage(tabs[0].id);
            }
        });
    }
});

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
        .then((response) => {
            if (!response.ok) throw new Error("Failed to send data");
            return response.json();
        })
        .then(() => {
            tabUsage = {}; // Only clear if the request succeeds
        })
        .catch((error) => {
            console.error("Error sending usage data:", error);
        });
    }
}, 30000);

console.log("Background script is running");