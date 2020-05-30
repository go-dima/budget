import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';
import * as _ from 'lodash';
import { IReportEntry } from '../IReportEntry';
import { BalanceReportService } from './balance-report.service';
import { AccountsService } from '../accounts-filter/accounts.service';
import Common from '../common';

@Component({
  selector: 'pm-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.css'],
})
export class BalanceReportComponent implements OnInit {
  readonly pageTitle: string = "Balance Report";
  report: IReportEntry[] = [];
  errorMessage: any;
  readonly groupByProperties: string[] = ["date", "category"];
  groupByProperty: string = this.groupByProperties[0];
  showAverages: boolean = true;

  sortBy: string = 'key';
  sortOrder: number = 1;
  readonly orderOptions: string[] = ['asc', 'desc'];

  constructor(private _transactionsService: TransactiosService,
              private _balanceReportService: BalanceReportService,
              private _accountsService: AccountsService) { }
  
  ngOnInit() {
    this._transactionsService.getAllTransactions().subscribe(
      transactions => {
        this._balanceReportService.accountGroups = _.groupBy(transactions, 'account');
        this.RefreshReport();},
      error => this.errorMessage = error
    );

    this._accountsService.accountsChanged.subscribe(() => this.RefreshReport());
  }
 
  private RefreshReport() {
    this.report = this._balanceReportService.selectedAccountsChanged(this._accountsService.selectedAccounts, this.groupByProperty);
  }

  selectedCategoriesChanged(selectedCategories: string[]) {
    this._balanceReportService.selectedCategories = selectedCategories;
    this.report = this._balanceReportService.generateReport(this.groupByProperty);
  }

  groupByPropertyChanged() {
    this.report = this._balanceReportService.generateReport(this.groupByProperty);
  }

  reorderReport(sortBy: string): any {
    this.sortBy = sortBy;
    this.sortOrder = 1 - this.sortOrder;
    this.report = this._balanceReportService.reorderReport(sortBy, this.orderOptions[this.sortOrder]);
  }

  displayAverages(): boolean {
    return this.groupByProperty == "category" && this.showAverages;
  }

  allowAverages(): boolean {
    return this.groupByProperty == "category";
  }

  getDisplayClass(data): string {
    return Common.convertToDisplayClass(data);
  }
}
