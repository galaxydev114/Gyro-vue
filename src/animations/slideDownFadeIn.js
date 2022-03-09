/**
 * @param {Element} el DOM Element
 */
export default function (el, opts = {}) {
  const { delay = 0, fill = 'auto' } = opts

  const animation = el.animate([
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: 300,
    easing: 'ease-out',
    delay: delay,
    fill: fill
  })

  return animation
}
