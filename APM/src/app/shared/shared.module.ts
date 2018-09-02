import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarComponent } from './star.component';
import { FormsModule } from '@angular/forms';
import { AccountsFilterComponentComponent } from './accounts-filter-component/accounts-filter-component.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    StarComponent,
    AccountsFilterComponentComponent,    
  ],
  exports: [
    StarComponent,
    CommonModule,
    FormsModule,
    AccountsFilterComponentComponent,
  ]
})
export class SharedModule { }
