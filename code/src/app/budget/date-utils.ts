export default class DateUtils {
    /**
    * Returns date string converted to yyyy-mm-dd format
    * @param date The date to be converted, as string format dd-mm-yyyy
    */
   static extractSortKey(date: string): string {
      return date.substring(6) + date.substring(2,6) + date.substring(0,2); /* yyyy-mm-dd */
    }
}