export default function (v) {
  const secNum = parseInt(v, 10)
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - (hours * 3600)) / 60)
  let seconds = secNum - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }

  const timeStr = minutes + ':' + seconds
  return hours.toString() !== '00' ? hours + ':' + timeStr : timeStr
}
