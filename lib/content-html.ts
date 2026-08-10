const allowedTags = new Set([
  "a", "blockquote", "br", "code", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "ol", "p", "pre", "strong", "ul",
]);
const droppedTags = "iframe|object|script|style|template|textarea";
const MAX_UNICODE_CODE_POINT = 0x10ffff;
const isUnicodeScalarValue = (codePoint: number) => (
  Number.isSafeInteger(codePoint)
  && codePoint > 0
  && codePoint <= MAX_UNICODE_CODE_POINT
  && (codePoint < 0xd800 || codePoint > 0xdfff)
);

const decodeNumericEntities = (value: string) => value
  .replace(/&#(?:x([0-9a-f]+)|([0-9]+));?/gi, (_match, hex: string, decimal: string) => {
    const codePoint = Number.parseInt(hex ?? decimal, hex ? 16 : 10);
    return isUnicodeScalarValue(codePoint) ? String.fromCodePoint(codePoint) : "";
  })
  .replace(/&colon;/gi, ":");

const isSafeUrl = (value: string, allowMailto: boolean) => {
  const normalized = decodeNumericEntities(value).trim();
  if (!normalized || normalized.split("").some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  })) return false;
  if (normalized.startsWith("/") || normalized.startsWith("#")) return true;
  try {
    const protocol = new URL(normalized).protocol.toLowerCase();
    return protocol === "http:" || protocol === "https:" || (allowMailto && protocol === "mailto:");
  } catch {
    return false;
  }
};

const escapeAttribute = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const sanitizeAttributes = (tagName: string, rawAttributes: string) => {
  const allowedAttributes = tagName === "a"
    ? new Set(["href", "rel", "target", "title"])
    : tagName === "img"
      ? new Set(["alt", "height", "src", "title", "width"])
      : new Set<string>();
  const attributes: string[] = [];
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attributePattern.exec(rawAttributes)) !== null) {
    const name = match[1].toLowerCase();
    if (!allowedAttributes.has(name)) continue;
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if ((name === "href" && !isSafeUrl(value, true)) || (name === "src" && !isSafeUrl(value, false))) continue;
    if (name === "target" && value !== "_blank" && value !== "_self") continue;
    if (name === "rel" && !/^(?:noopener|noreferrer|nofollow)(?:\s+(?:noopener|noreferrer|nofollow))*$/.test(value)) continue;
    attributes.push(`${name}="${escapeAttribute(value)}"`);
  }
  if (tagName === "a" && attributes.includes('target="_blank"') && !attributes.some((attribute) => attribute.startsWith("rel=\""))) {
    attributes.push('rel="noopener noreferrer"');
  }
  return attributes.length ? ` ${attributes.join(" ")}` : "";
};

export const sanitizePublicHtml = (html: string) => {
  const withoutDangerousBlocks = html
    .replace(new RegExp(`<\\s*(${droppedTags})\\b[^>]*>[\\s\\S]*?<\\/\\s*\\1\\s*>`, "gi"), "")
    .replace(new RegExp(`<\\s*(?:${droppedTags})\\b[^>]*\\/\\s*>`, "gi"), "");
  return withoutDangerousBlocks.replace(/<!--[\s\S]*?-->|<\/?\s*([a-z0-9-]+)([^>]*)>/gi, (fullMatch, rawTagName: string, rawAttributes: string) => {
    if (fullMatch.startsWith("<!--")) return "";
    const tagName = rawTagName.toLowerCase();
    if (!allowedTags.has(tagName)) return "";
    if (/^<\//.test(fullMatch)) return `</${tagName}>`;
    const selfClosing = /\/\s*>$/.test(fullMatch);
    return `<${tagName}${sanitizeAttributes(tagName, rawAttributes.replace(/\/\s*$/, ""))}${selfClosing ? " /" : ""}>`;
  });
};
