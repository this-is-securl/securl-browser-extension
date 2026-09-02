# Chrome Web Store listing draft

## Name

SecURL: Check a Link

## Short description

Trace where a public link goes before deciding whether to open it.

## Detailed description

Right-click an HTTP or HTTPS link and choose **Check link with SecURL**. SecURL opens its
public checker with the exact link prefilled so you can review it and deliberately start a
passive trace.

The checker can show the redirect path, final destination, response type and URL
characteristics worth noticing. It does not execute the destination page in your browser,
download files, submit forms or promise that a destination is safe.

The extension requests only the context-menu permission. It does not read browsing history,
inject scripts, scan pages automatically or request access to website contents.

## Category

Tools

## Single purpose

Open a user-selected public web link in SecURL's passive Link Checker.

## Permission justification

`contextMenus` adds the user-invoked **Check link with SecURL** command to HTTP and HTTPS
links. No other extension permission or host permission is requested.

## Privacy practices

- Single purpose: open a user-selected public HTTP or HTTPS link in SecURL's passive Link Checker.
- Data use: the extension does not collect, store or sell user data. The selected URL is placed in
  a fragment-only handoff to `securl.online`, removed from the browser address before telemetry, and
  inspected only after the user deliberately chooses **Trace this link**.
- Remote code: none.
- Host permissions: none.
- Privacy policy: https://securl.online/privacy

## Store assets

- Extension icon: `icons/icon-128.png`
- Small promotional tile: `store-assets/small-promo.png` (440x280)
- Screenshot 1: `store-assets/screenshot-link-result.jpg` (1280x800)
- Screenshot 2: `store-assets/screenshot-redirect-evidence.jpg` (1280x800)
