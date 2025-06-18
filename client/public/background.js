let thisSession = {}
let siteTimer = 0;
let timerId;
let currentUrl;
console.log('runningggggggggggggggggggggggggggggg')

// Functions:

let formatUrl = (url) => {
  let split_url = url.split('/')
  shortened_url = split_url[2]
  return shortened_url
}

let startSiteTimer = (url) => {
  if (timerId) {
    clearInterval(timerId);
    timerId = false;
  }
  siteTimer = 0
  timerId = setInterval(() => {siteTimer += 1000}, 1000)
}

let updateSession = (url) => {
  if (timerId) {
    clearInterval(timerId);
    timerId = false;
  }
  thisSession[url] ? thisSession[url] += siteTimer : thisSession[url] = siteTimer
  siteTimer = 0
}

async function getFirstTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  let formattedUrl = formatUrl(tab.url);
  currentUrl = formattedUrl
  startSiteTimer(currentUrl)
  console.log('started timer: ', currentUrl)
}

// Listeners:

getFirstTab()

chrome.tabs.onActivated.addListener(function(activeInfo) { // listens for when tab changes, fires callback function
  if (currentUrl) {
    updateSession(currentUrl); // if previous listeners have been triggered, thisSession will get updated with the last siteTimer
  }
  chrome.tabs.get(activeInfo.tabId, function(tab) { // full tab object passed into callback function by chrome api
    currentUrl = formatUrl(tab.url);
    startSiteTimer(currentUrl)
    console.log(thisSession)
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Only act if URL changed AND the tab is active (in current window)
  if (changeInfo.url && tab.active) {
    if (currentUrl) {
      updateSession(currentUrl);
    }
    currentUrl = formatUrl(changeInfo.url);
    startSiteTimer(currentUrl);
    console.log(thisSession);
  }
});

const websocket = new WebSocket('ws://localhost:3010/socket');
console.log('websocket line compiled')
websocket.onopen = (event) => {
  console.log('WSS opened')
};

setInterval(() => {
  websocket.send(JSON.stringify(thisSession))
  console.log('session sent:', thisSession)
  thisSession = {}
}, 10000)