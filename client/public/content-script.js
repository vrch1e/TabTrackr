console.log('content script running: ', chrome.runtime)
window.__CONTENT_SCRIPT__ = true;

window.postMessage({ type: "CONTENT_SCRIPT_RUNNING" }, "*");

window.addEventListener("message", async (event) => {

    if (event.data.type === "REQUEST_SITE_TABS") {
        console.log('content script received message')
        chrome.runtime.sendMessage({ type: "GET_SITE_TABS" }, (response) => {
            console.log('response from background: ', response);
            const sites = response.sites;
            window.postMessage({ type: "RECEIVE_SITE_TABS", sites: sites })
        })
    }

});
