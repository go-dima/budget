import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TransactionsComponent } from './transactions-list/transactions-list.component';
import { TransactiosService } from './transactions.service';
import { AccountsFilterComponentComponent } from './accounts-filter-component/accounts-filter-component.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'transactions', component: TransactionsComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    ]),
    SharedModule
  ],
  declarations: [
    TransactionsComponent,
    AccountsFilterComponentComponent,
  ],
  providers: [
    TransactiosService
  ]
})
export class BudgetModule { }
