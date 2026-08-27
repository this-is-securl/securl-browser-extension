# SecURL: Check a Link

Inspect a public link with SecURL from the browser context menu. Right-click a link, choose
**Check link with SecURL**, review the prefilled URL, then decide whether to trace it.

The extension does not scan pages automatically, read browsing history, inject scripts,
request access to websites, or claim that a destination is safe.

## Permission boundary

The manifest requests one permission: `contextMenus`. The command is shown only for HTTP
and HTTPS links. Selecting it opens:

```text
https://securl.online/check-link#url=<encoded-link>&source=browser_extension
```

The selected link is kept in the URL fragment, which browsers do not send in the document
request. The SecURL page reads the fragment, clears it from the address bar before telemetry,
and prefills the checker. The link is submitted to the SecURL inspection API only when the
user deliberately chooses **Trace this link**.

## Load the development build

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select this repository directory.
5. Right-click an HTTP or HTTPS link and choose **Check link with SecURL**.

## Verify

```sh
npm test
```

The tests validate the fragment-only handoff, supported schemes, minimal manifest
permissions, and extension metadata. There is no bundler and there are no runtime
dependencies.

## Safety

Use SecURL as additional evidence, not as a promise that a link is safe. The checker follows
bounded public redirects and reports the destination and observable URL characteristics. It
does not execute the destination page in the user's browser.

- [Web checker](https://securl.online/check-link)
- [SecURL engine](https://github.com/this-is-securl/securl)
- [Privacy](./PRIVACY.md)
- [Security reporting](./SECURITY.md)
