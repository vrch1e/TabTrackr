# TabTrackr
A chrome extension that tracks tab usage

in the public folder, you'll find a background.js file which is responsible for running in the background and tracking the tab usage data. This data will be sent to the server every 30 seconds as you'll see in the setInterval.

The manifest.json file is responsible for providing metadata to the browser, e.g. extension permissions, icons, and important files like background.js, and index.html.


FOR USE:

1: Fork and clone the repo
2: In the client folder, run 'npm install'. Then 'npm run build'.
3: In the server folder, run 'npm install'. Then 'nodemon server.js'.
4: Go to chrome://extensions/ in the browser, and click 'load unpacked' in the top left.
5: Turn the extension on and you should see the extension running without errors.