/// <reference types="chrome" />
import services from '../src/services/services'
import { Visit } from '../../types';

let activeTabId: number | undefined = undefined;
let activeTabUrl: string = ''; 
let lastTick: number = Date.now();
let tabUsage: Visit[] = []; 

function recordUsage() {
  const now: number = Date.now();
  const elapsed: number = now - lastTick;
  lastTick = now;
  if (activeTabId && activeTabUrl) {
    const visitIndex: number = tabUsage.findIndex( visit => visit.site === activeTabUrl);
    if (visitIndex !== -1) {
      tabUsage[visitIndex].timeSpent += elapsed; }
    else {
      const newVisit: Visit = { site: activeTabUrl, timeSpent: elapsed };
      tabUsage.push(newVisit);
    }
  }
}

function updateActiveTab(newTabId: number | undefined) {
  recordUsage();
  activeTabId = newTabId;

  activeTabUrl = '';
  if (newTabId) {
    chrome.tabs.get(newTabId, (tab: chrome.tabs.Tab) => {
      if (!chrome.runtime.lastError && tab && tab.url) {
        activeTabUrl = new URL(tab.url).hostname;
      }
    });
  }
}

chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
  updateActiveTab(activeInfo.tabId);
});

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

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  if (tabId === activeTabId && changeInfo.url) {
    recordUsage();
    activeTabUrl = new URL(changeInfo.url).hostname;
  }
});

chrome.tabs.onRemoved.addListener((tabId: number) => {
  if (tabId === activeTabId) {
    updateActiveTab(undefined);
  }
});

setInterval(recordUsage, 1000);

setInterval(() => {
  recordUsage();
  if (tabUsage.length) {
    services.postSites(tabUsage).then(() => { tabUsage = [] }); 
  }
}, 30000);
