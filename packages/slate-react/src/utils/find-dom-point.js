import findDOMNode from './find-dom-node'

/**
 * Find a native DOM selection point from a Slate `point`.
 *
 * @param {Point} point
 * @param {Window} win (optional)
 * @return {Object|Null}
 */

function findDOMPoint(point, win = window) {
  const el = findDOMNode(point.key, win)
  let start = 0

  // For each leaf, we need to isolate its content, which means filtering to its
  // direct text and zero-width spans. (We have to filter out any other siblings
  // that may have been rendered alongside them.)
  const texts = Array.from(
    el.querySelectorAll('[data-slate-content], [data-slate-zero-width]')
  )

  for (const text of texts) {
    const node = text.childNodes[0]

    // Account zero-width spaces which shouldn't really take up space, because
    // we only render them when the text is empty.
    const length = node.textContent === '\uFEFF' ? 0 : node.textContent.length
    const end = start + length

    if (point.offset <= end) {
      const offset = Math.max(0, point.offset - start)
      return { node, offset }
    }

    start = end
  }

  return null
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMPoint
