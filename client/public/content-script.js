
console.log('content script running: ', chrome.runtime)

window.postMessage({ type: "CONTENT_SCRIPT_RUNNING" }, "*");
window.addEventListener("message", async (event) => {
    if (event.data.type !== "REQUEST_AUTH_TOKEN") return;
    console.log('message received in content script')

    chrome.runtime.sendMessage({ type: "GET_AUTH_TOKEN" }, (res) => {
        window.postMessage({
            type: "RECEIVE_AUTH_TOKEN",
            token: res.token
        });
    });
});
