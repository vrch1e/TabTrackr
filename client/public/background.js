import services from "./bgservices.js";

let userId, token, expiresAt;

chrome.runtime.onMessage.addListener( (req, sender, sendResponse) => {
  if (req.type === "GET_SITE_TABS") {
    services.getAllSites(userId).then(sites => {
      sendResponse({ sites })
    })
    return true;
  }
  if (req.type === "OPEN_APP") {
    console.log('app opened')
    chrome.tabs.create({ url: "http://localhost:5173/homepage" })
  }
  return true;
})

// Load the user ID from storage
chrome.storage.local.get(['userId', 'token', 'expiresAt'],  async (result) => {
  userId = result.userId;
  token = result.token;
  expiresAt = result.expiresAt;
  const now = Date.now()
  
  console.log('token variable set in service worker!')

  if (!token || !expiresAt || now > expiresAt) {
    // Generate a new token if it doesn't exist
    userId = userId || crypto.randomUUID();
    expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

    const response = await fetch('http://localhost:3010/session/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userId })
    })

    const data = await response.json();
    token = data.token;

    await chrome.storage.local.set({ userId, token, expiresAt });
    console.log('set token in background.js, ', token);
  } else {
    console.log('token already exists!, ', token);
  }
  
  backgroundInit(userId);

})

function backgroundInit(userId) {
  let thisSession = {'usage': {}, 'userId': userId}
  let siteTimer = null;
  let currentUrl;
  console.log('running: ', thisSession['usage'])

  // Functions:

  let formatUrl = (url) => { // makes the url something like website.com
    let split_url = url.split('/')
    let shortened_url = split_url[2]
    return shortened_url
  }

  let startSiteTimer = () => {
    siteTimer = Date.now()
  }

  let updateSession = (url) => {

    if (!siteTimer) return;

    // time spent on tab
    let elapsed = Date.now() - siteTimer

    // if url is already in session object, update the url time. Otherwise initiate it as current elapsed time.
    if (thisSession['usage'][formatUrl(url)]) {
      thisSession['usage'][formatUrl(url)]['timespent'] += elapsed
    } else {
      if (url.length > 250) {
        url = `https://${formatUrl(url)}`
      }
      thisSession['usage'][formatUrl(url)] = {'site': formatUrl(url), 'url': url, 'timespent': elapsed}
    }
  }

  async function getFirstTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    currentUrl = tab.url
    startSiteTimer()
    console.log('started timer: ', currentUrl)
  }

  // Listeners:

  getFirstTab()

  chrome.tabs.onActivated.addListener(function(activeInfo) { // listens for when tab changes, fires callback function
    if (currentUrl) {
      updateSession(currentUrl); // if previous listeners have been triggered, thisSession will get updated with the last siteTimer
    }
    chrome.tabs.get(activeInfo.tabId, function(tab) { // full tab object passed into callback function by chrome api
      currentUrl = tab.url;
      startSiteTimer()
      // console.log('new tab: ', currentUrl)
    });
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Only act if URL changed AND the tab is active (in current window)
    if (changeInfo.url && tab.active) {
      if (currentUrl) {
        updateSession(currentUrl);
      }
      currentUrl = changeInfo.url;
      startSiteTimer();
    }
  });

  chrome.windows.onFocusChanged.addListener((windowId) => {

      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        // browser lost focus → stop timing
        if (currentUrl) {
          updateSession(currentUrl)
          siteTimer = null;
          // console.log('focus out of chrome')
        }
      } else {
      // browser gained focus → find current tab
      chrome.tabs.query({ active: true, windowId }, (tabs) => {
        if (tabs.length) {
          currentUrl = tabs[0].url;
          startSiteTimer()
          // console.log('focus into chrome')
        }
      });
    }
  });

  // Websocket connection:

  const websocket = new WebSocket('ws://localhost:3010/socket');
  console.log('websocket line compiled')
  websocket.onopen = (event) => {
    console.log('WSS opened')
  };

  chrome.runtime.onSuspend.addListener(() => {
    websocket.send(JSON.stringify(thisSession))
    websocket.send(JSON.stringify({'background service suspended': true}))

    console.log('chrome closed, session sent:', thisSession)
    thisSession = {'usage': {}, 'usageId': userId}
    return;
  })

  setInterval(() => {
    websocket.send(JSON.stringify(thisSession))
    // console.log('15 secs up, session sent:', thisSession['usage'])
    thisSession = {'usage': {}, 'userId': userId}
  }, 15000)
}
