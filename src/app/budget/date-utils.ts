export default class DateUtils {
  /**
   * Returns date string converted to yyyy-mm-dd format
   * @param date The date to be converted, as string format dd-mm-yyyy
   */
  static sortableDate(date: string): string {
    return date.substring(6) + date.substring(3,5) + date.substring(0,2); /* yyyymmdd */
  }

  static max(first: string, second: string): string {
    return DateUtils.sortableDate(first) > DateUtils.sortableDate(second) ? first : second;
  }

  static isBigger(first: string, second: string) {
    return first == DateUtils.max(first, second);
  }
}