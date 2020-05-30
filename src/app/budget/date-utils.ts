import { ITransaction } from "./ITransaction";

export default class DateUtils {
  /**
   * Returns date string converted to yyyy-mm-dd format
   * @param date The date to be converted, as string format dd-mm-yyyy
   */
  static extractSortKey(date: string): string {
    return date.substring(6) + date.substring(3,5) + date.substring(0,2); /* yyyymmdd */
  }

  static max(first: string, second: string): string {
    return first > second ? DateUtils.extractSortKey(first) : DateUtils.extractSortKey(second);
  }
}