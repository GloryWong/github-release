export function parseHtmlAndBlankAnchor(htmlString: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  const anchors = doc.querySelectorAll('a')

  anchors.forEach((anchor) => {
    anchor.setAttribute('target', '_blank')
  })

  return doc.body
}
