import { Injectable } from "@angular/core";
import { IReportEntry } from "../IReportEntry";
import { ITransaction } from "../ITransaction";
import * as _ from "lodash";
import { Dictionary } from "lodash";
import { ReplaySubject } from "rxjs";

@Injectable()
export class BalanceReportService {
  report: IReportEntry[];
  selectedAccounts: string[] = [];
  accountGroups: Dictionary<ITransaction[]>;
  selectedCategories: string[];
  generatedReportSubject: ReplaySubject<IReportEntry[]> = new ReplaySubject<IReportEntry[]>(1);
  sortBy: string = 'key';
  sortOrder: string = 'asc';
  
  generateReport(groupByProperty: string): IReportEntry[] {
    let self = this;
        self.report = [];
        _.forEach(_.keys(this.accountGroups), function (key) {
          if (self.selectedAccounts.includes(key)) {
            let filteredTransactions = self.filterCategories(self.accountGroups[key], self.selectedCategories);
            let monthlyGroups = _.groupBy(filteredTransactions,
                                          function(t: ITransaction) { return self.extractKey(t, groupByProperty); });
            _.forEach(monthlyGroups, function (monthReport: ITransaction[], monthKey: string) {
              _.forEach(monthReport, function (t: ITransaction) {
                self.addOrUpdate(self.report, monthKey, t.amount, self.extractDisplayKey(t, groupByProperty));
              });
            });
          }
        });
        self.report = _.values(self.report);
        self.report = self.reorderReport(this.sortBy, this.sortOrder);
        self.generatedReportSubject.next(self.report);
        return self.report;
      }
      
      private filterCategories(toFilter: ITransaction[], selectedCategories: string[]): ArrayLike<ITransaction> {
        if (!selectedCategories)
          return toFilter;
        
        let filtered = toFilter.filter(function(t: ITransaction) {
          return selectedCategories.includes(t.category);
        });
        return filtered;
      }

      extractKey(t: ITransaction, groupBy: string): string {
        if (groupBy == "date")
           return t.date.substring(6) + t.date.substring(2,5);// yyyy-mm
        else
          return t.category;
      }
      
      extractDisplayKey(t: ITransaction, groupBy: string): string {
        if (groupBy == "date")
           return t.date.substring(3);// mm-yyyy
        else
          return t.category;
      }

      addOrUpdate(report: IReportEntry[], key: string, value: number, displayKey: string) {
        if (!_.has(report, key)) {
          report[key] = { 
                          key: key,
                          displayKey: displayKey,
                          income: {total: 0, average: 0, occurences: 0},
                          expense: {total: 0, average: 0, occurences: 0},
                          overall: 0
                        };
        }
        
        if (value > 0) {
          report[key].income.total += value;
          report[key].income.occurences++;
          report[key].income.average = report[key].income.total / report[key].income.occurences;
        }
        else if (value < 0){
          report[key].expense.total += value;
          report[key].expense.occurences++;
          report[key].expense.average = report[key].expense.total / report[key].expense.occurences; 
        }
        
        report[key].overall += value;
      }

      reorderReport(sortBy: string, sortOrder: string): IReportEntry[] {
        this.sortBy = sortBy
        this.sortOrder = sortOrder
        return _.orderBy(this.report, this.sortBy, this.sortOrder);
      }

      selectedAccountsChanged(selectedAccounts: string[], groupByProperty: string) {
        this.selectedAccounts = selectedAccounts;
        this.report = this.generateReport(groupByProperty);
        return this.report;
      }
}