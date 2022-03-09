export default function (htmlString) {
  const doc = new DOMParser().parseFromString(`<doc>${htmlString}</doc>`, 'application/xml')
  return doc.documentElement.querySelector('parsererror')
    // revert back to raw string if we couldn't parse it
    ? htmlString?.replace(/[^0-9A-Za-z ]/g, c => '&#' + c.charCodeAt(0) + ';')
    : doc.documentElement.textContent
}
