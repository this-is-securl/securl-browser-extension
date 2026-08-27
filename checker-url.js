const CHECKER_URL = "https://securl.online/check-link";

export function buildCheckerUrl(linkUrl) {
  if (typeof linkUrl !== "string" || !linkUrl.trim()) {
    throw new TypeError("A link URL is required.");
  }

  const parsed = new URL(linkUrl);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new TypeError("Only public HTTP and HTTPS links are supported.");
  }

  const fragment = new URLSearchParams({
    url: linkUrl,
    source: "browser_extension",
  });
  return `${CHECKER_URL}#${fragment.toString()}`;
}
