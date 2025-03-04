let activeTabId = null;
let tabStartTime = null;
let tabUsage = {}; // Sent to DB & cleared after sending

function updateTabUsage(newTabId) {
    if (activeTabId !== null && tabStartTime !== null) {
        const timeSpent = Date.now() - tabStartTime;

        chrome.tabs.get(activeTabId, (tab) => {
            if (chrome.runtime.lastError || !tab || !tab.url) return;

            const site = new URL(tab.url).hostname;
            tabUsage[site] = (tabUsage[site] || 0) + timeSpent;

            console.log(`Logged time for ${site}: ${timeSpent} ms`);
        });
    }

    activeTabId = newTabId;
    tabStartTime = Date.now();
}

// Track when a tab becomes active
chrome.tabs.onActivated.addListener((activeInfo) => {
    updateTabUsage(activeInfo.tabId);
});

// Track when a window is focused or unfocused
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        updateTabUsage(null); // No active window, stop tracking
    } else {
        chrome.tabs.query({ active: true, windowId }, (tabs) => {
            if (tabs.length > 0) {
                updateTabUsage(tabs[0].id);
            }
        });
    }
});

// Track when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) {
        updateTabUsage(null);
    }
});

// Send usage data every 30 seconds
setInterval(() => {
    if (Object.keys(tabUsage).length > 0) {
        const usageData = Object.entries(tabUsage).map(([site, timespent]) => ({
            site,
            timespent,
        }));

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
            tabUsage = {}; // Only clear if request succeeds
        })
        .catch((error) => {
            console.error("Error sending usage data:", error);
        });
    }
}, 30000);

console.log("Background script is running");
