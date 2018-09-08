import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ICheckbox } from '../ICheckbox';
import { TransactiosService } from '../transactions.service';
import { ITransaction } from '../ITransaction';
import * as _ from 'lodash';

@Component({
  selector: 'pm-property-filter',
  templateUrl: './property-filter.component.html',
  styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent implements OnInit {
  properties: ICheckbox[];
  @Output() selectedProperties: EventEmitter<string[]> = new EventEmitter<string[]>();
  errorMessage: string;

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.properties = _.uniqBy(transactions, 'category').map(this.transactionToProperty);
            this.selectedPropertiesChanged(null);
        },
        error => this.errorMessage = <any>error
    );
  }

  transactionToProperty(transaction: ITransaction): ICheckbox {
    return { name: transaction.category, isChecked: true };
  }
  
  selectedPropertiesChanged(event: any) {
    let checkedProperties = this.properties.filter((prop: ICheckbox) => prop.isChecked)
                                           .map(prop => prop.name);
    this.selectedProperties.emit(checkedProperties);
  }
}
