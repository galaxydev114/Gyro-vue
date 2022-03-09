import dayjs from 'dayjs'

export default function asDayJsHours (value) {
  const [hour, minutes] = value.split(':')
  return dayjs()
    .set('hour', hour)
    .set('minute', minutes)
}
