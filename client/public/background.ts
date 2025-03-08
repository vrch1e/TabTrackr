/// <reference types="chrome" />
import services from '../src/services/services.ts'
import { VisitToDB } from '../../types';

let activeTabId: number | undefined = undefined;
let activeTabUrl: string = ''; // Hostname of the active tab
let lastTick: number = Date.now();
let tabUsage: object = {}; // Accumulates usage per site

// Record elapsed time for the current active tab
function recordUsage() {
  const now: number = Date.now();
  const elapsed: number = now - lastTick;
  lastTick = now;
  if (activeTabId && activeTabUrl) {
    tabUsage[activeTabUrl] = (tabUsage[activeTabUrl] || 0) + elapsed;
    // console.log(`Tick: logged ${elapsed}ms for ${activeTabUrl}`);
  }
}

// Update the active tab and record any pending time from the previous tab
function updateActiveTab(newTabId: number | undefined) {
  // Record any usage from the previous active tab
  recordUsage();
  activeTabId = newTabId;

  /* if (newTabId) {
    chrome.tabs.get(newTabId, (tab: chrome.tabs.Tab) => {
      if (chrome.runtime.lastError || !tab || !tab.url) {
        activeTabUrl = '';
      } else {
        activeTabUrl = new URL(tab.url).hostname;
        // console.log(`Switched to tab ${newTabId}: ${activeTabUrl}`);
      }
    });
  } else {
    activeTabUrl = '';
    // console.log("No active tab");
  } */

  // todo done: refactored
  activeTabUrl = '';
  if (newTabId) {
    chrome.tabs.get(newTabId, (tab: chrome.tabs.Tab) => {
      if (!chrome.runtime.lastError && tab && tab.url) {
        activeTabUrl = new URL(tab.url).hostname;
      }
    })
  }
}

// Listen for tab activation changes
chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
  updateActiveTab(activeInfo.tabId);
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId: number) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateActiveTab(undefined); // Browser lost focus
  } else {
    chrome.tabs.query({ active: true, windowId }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs.length) {
        updateActiveTab(tabs[0].id);
      }
    });
  }
});

// Listen for url changes within the active tab
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => { // todo: type TabChangeInfo
  if (tabId === activeTabId && changeInfo.url) {
    // Record time for the previous url, then update to the new one
    recordUsage();
    activeTabUrl = new URL(changeInfo.url).hostname;
    // console.log(`Tab ${tabId} updated URL to: ${activeTabUrl}`);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId: number) => {
  if (tabId === activeTabId) {
    updateActiveTab(undefined);
  }
});

// todo: test and remove if unnec.
//record usage every second
setInterval(recordUsage, 1000);

// Send usage data every 30 seconds
setInterval(() => {
  //Capture the latest time before sending
  recordUsage();
  if (Object.keys(tabUsage).length) {
    const usageData: VisitToDB[] = Object.entries(tabUsage).map(([site, timespent]) => ({
      site,
      timespent,
    }));
    // console.log("Sending tabUsage:", usageData);
    services.postSites(usageData).then(() => { tabUsage = {} }); // Clear usage if request succeeds
  }
}, 30000);

// console.log("background tab tracking script is running");

