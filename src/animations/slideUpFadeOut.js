/**
 * @param {Element} el DOM Element
 */
export default function (el, opts = {}) {
  const {
    translate = '-20px',
    fill = 'forwards',
    delay = 0
  } = opts

  const animation = el.animate([
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: `translateY(${translate})` }
  ], {
    duration: 300,
    easing: 'ease-in',
    delay: delay,
    fill: fill
  })

  return animation
}
