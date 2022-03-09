export default function (option, dayjsClass, dayjsFactory) {
  /**
   * Rounds the time up to the nearest block of minsBlockSize minutes. e.g. If
   * the current time is 9:04 and a minsBlockSize of 10 is given, the result
   * will be 9:10. If a minsBlockSize of 30 is given, the result will be 9:30
   */
  dayjsClass.prototype.roundMinsBlock = function (minsBlockSize) {
    const numMinsBlocks = Math.floor((this.minute() + minsBlockSize - 1) / minsBlockSize)
    return this.minute(numMinsBlocks * minsBlockSize)
  }
}
