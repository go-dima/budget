import { Injectable } from "@angular/core";
import { IReportEntry } from "../IReportEntry";
import { ITransaction } from "../ITransaction";
import * as _ from "lodash";
import { Dictionary } from "lodash";

@Injectable()
export class BalanceReportService {
    report: IReportEntry[];
    selectedAccounts: string[];
    accountGroups: Dictionary<ITransaction[]>;
    selectedCategories: string[];
    
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
                self.addOrUpdate(self.report, monthKey, t.amount);
              });
            });
          }
        });
        self.report = _.values(self.report);
        self.report = self.reorderReport('key', 'asc');
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
          return t.date.substring(3);
        else
          return t.category;
      }
      
      addOrUpdate(report: IReportEntry[], key: string, value: number) {
        if (!_.has(report, key)) {
          report[key] = { 
                          key: key,
                          income: {total: 0, average: 0, occurences: 0},
                          expense: {total: 0, average: 0, occurences: 0},
                          balance: 0
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
        
        report[key].balance += value;
      }

      reorderReport(sortBy: string, sortOrder: string): IReportEntry[] {
        return _.orderBy(this.report, sortBy, sortOrder);
      }
}