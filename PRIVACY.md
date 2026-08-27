# Privacy

SecURL: Check a Link does not collect browsing history, inspect pages automatically, inject
content scripts, store selected links, or request access to website contents.

The extension receives a link only when the user chooses **Check link with SecURL** from the
context menu. It opens the public SecURL checker with that link encoded in the URL fragment.
The fragment is not part of the web request and is removed by the checker before telemetry.
The selected link reaches the SecURL inspection service only if the user deliberately starts
the trace from the checker page.

The hosted SecURL privacy notice is available at https://securl.online/privacy.html.
