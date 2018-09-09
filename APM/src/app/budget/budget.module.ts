import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TransactionsComponent } from './transactions-list/transactions-list.component';
import { TransactiosService } from './transactions.service';
import { AccountsFilterComponent } from './accounts-filter/accounts-filter.component';
import { BalanceReportComponent } from './balance-report/balance-report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'transactions', component: TransactionsComponent },
      { path: 'balance-report', component: BalanceReportComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    ]),
    SharedModule
  ],
  declarations: [
    TransactionsComponent,
    AccountsFilterComponent,
    BalanceReportComponent,
  ],
  providers: [
    TransactiosService
  ]
})
export class BudgetModule { }
