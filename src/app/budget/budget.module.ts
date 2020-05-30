import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TransactionsComponent } from './transactions-list/transactions-list.component';
import { TransactiosService } from './transactions.service';
import { BalanceReportComponent } from './balance-report/balance-report.component';
import { PropertyFilterComponent } from './property-filter/property-filter.component';
import { BalanceReportService } from './balance-report/balance-report.service';
import { ChartComponent } from './chart/chart.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AccountsFilterComponent } from './accounts-filter/accounts-filter.component';
import { TransactionsChartComponent } from './transactions-chart/transactions-chart.component';
import { ConvertToDisplayClassPipe } from '../shared/convert-to-display-class.pipe';
import { AccountsSummaryComponent } from './accounts-summary/accounts-summary.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'transactions', component: TransactionsComponent },
      { path: 'balance-report', component: BalanceReportComponent },
      { path: 'accounts-summary', component: AccountsSummaryComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    ]),
    SharedModule,
  ],
  declarations: [
    TransactionsComponent,
    BalanceReportComponent,
    PropertyFilterComponent,
    ChartComponent,
    FileUploadComponent,
    AccountsFilterComponent,
    TransactionsChartComponent,
    ConvertToDisplayClassPipe,
    AccountsSummaryComponent,
  ],
  providers: [
    TransactiosService,
    BalanceReportService
  ],
  exports: [
    FileUploadComponent,
    AccountsFilterComponent
  ]
})
export class BudgetModule { }
