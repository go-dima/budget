import { ITransaction } from "./ITransaction";
import { ICheckbox } from "./ICheckbox";
import DateUtils from "./date-utils";

export default class Common {
  static transactionToAccount(transaction: ITransaction): ICheckbox {
    return { name: transaction.account, isChecked: true };
  }
  
  /**
   * Returns date attribute converted to yyyymmdd format
   * @param transaction The to extract date from
   */  
  static transactionDateKey(transaction: ITransaction): string { /* transaction.date -> yyyymmdd */
    return DateUtils.extractSortKey(transaction.date);
  }
  
  static accumulate(collection: number[]): number {
    return collection.reduce((a,b) => a + b)
  }
}