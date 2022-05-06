export const padTime = (val) => {
  val = Math.floor(val)
  if (val < 10) {
    return '0' + val
  }
  return val + ''
}

export const durationStrFromSec = (duration) => {
  let minutes = 0
  let seconds = 0
  if (duration > 0) {
    minutes = Math.floor(duration / 60)
    seconds = duration - minutes * 60
    return `${padTime(minutes)}:${padTime(seconds)}`
  } else {
    return undefined
  }
}
