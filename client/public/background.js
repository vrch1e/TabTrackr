
let getCurrentTab = async () => {
  let tab = await chrome.tabs.query({active: true, lastFocusedWindow: true})
  console.log(tab)
  return tab
}

setInterval(getCurrentTab, 5000)