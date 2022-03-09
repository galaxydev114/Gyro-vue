export default {
  methods: {
    calculateDiffLength (endTime, startTime) {
      return endTime.diff(startTime, 'hours', true)
    },
    getTrainingForDay (day, hoursPlayADay, timeInADayArray) {
      const timeToRealtime = { 1: 10, 2: 16, 3: 20, 4: 24 }

      if (hoursPlayADay >= '5' && timeInADayArray.length > 1) {
        const startEventTimeFirst = this.$date().startOf('isoWeek').add(day - 1, 'days').add(timeToRealtime[parseInt(timeInADayArray[0])], 'hours')
        const endEventTimeFirst = startEventTimeFirst.clone().add(Math.ceil(hoursPlayADay / 2), 'hours')
        const startEventTimeSecond = this.$date().startOf('isoWeek').add(day - 1, 'days').add(timeToRealtime[parseInt(timeInADayArray[1])], 'hours')
        const endEventTimeSecond = startEventTimeSecond.clone().add(Math.floor(hoursPlayADay / 2), 'hours')
        return [{
          startDay: startEventTimeFirst.isoWeekday(),
          startHour: startEventTimeFirst.format('HH:mm'),
          length: this.calculateDiffLength(endEventTimeFirst, startEventTimeFirst),
          title: 'Fortnite time'
        }, {
          startDay: startEventTimeSecond.isoWeekday(),
          startHour: startEventTimeSecond.format('HH:mm'),
          length: this.calculateDiffLength(endEventTimeSecond, startEventTimeSecond),
          title: 'Fortnite time'
        }]
      } else if ((day === 6 || day === 7) && hoursPlayADay >= 3) {
        const startEventTimeFirst = this.$date().startOf('isoWeek').add(day - 1, 'days').add(timeToRealtime[parseInt(timeInADayArray[0])], 'hours')
        const endEventTimeFirst = startEventTimeFirst.clone().add(Math.ceil(hoursPlayADay / 2), 'hours')
        const startEventTimeSecond = this.$date().startOf('isoWeek').add(day - 1, 'days').add(timeToRealtime[(parseInt(timeInADayArray[0] === 3 ? 2 : 3))], 'hours')
        const endEventTimeSecond = startEventTimeSecond.clone().add(Math.ceil(hoursPlayADay / 2), 'hours')

        return [{
          startDay: startEventTimeFirst.isoWeekday(),
          startHour: startEventTimeFirst.format('HH:mm'),
          length: this.calculateDiffLength(endEventTimeFirst, startEventTimeFirst),
          title: 'Fortnite time'
        }, {
          startDay: startEventTimeSecond.isoWeekday(),
          startHour: startEventTimeSecond.format('HH:mm'),
          length: this.calculateDiffLength(endEventTimeSecond, startEventTimeSecond),
          title: 'Fortnite time'
        }]
      } else {
        const startEventTime = this.$date().startOf('isoWeek').add(day - 1, 'days').add(timeToRealtime[parseInt(timeInADayArray[0])], 'hours')
        const endEventTime = startEventTime.clone().add(hoursPlayADay, 'hours')
        return [{
          startDay: startEventTime.isoWeekday(),
          startHour: startEventTime.format('HH:mm'),
          length: this.calculateDiffLength(endEventTime, startEventTime),
          title: 'Fortnite time'
        }]
      }
    }
  }
}
