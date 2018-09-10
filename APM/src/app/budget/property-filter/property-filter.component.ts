import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
  @Input() filterProperty: string;
  @Output() selectedProperties: EventEmitter<string[]> = new EventEmitter<string[]>();
  properties: ICheckbox[];
  errorMessage: string;

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    let self = this;
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.properties = _.uniqBy(transactions, this.filterProperty)
                               .map(function(transaction: ITransaction) {
                                  return { name: _.get(transaction, self.filterProperty), isChecked: true };
                               });
            this.selectedPropertiesChanged(null);
        },
        error => this.errorMessage = <any>error
    );
  }

  transactionToProperty(transaction: ITransaction): ICheckbox {
    return { name: _.get(transaction, this.filterProperty), isChecked: true };
  }
  
  selectedPropertiesChanged(event: any) {
    let checkedProperties = this.properties.filter((prop: ICheckbox) => prop.isChecked)
                                           .map(prop => prop.name);
    this.selectedProperties.emit(checkedProperties);
  }
}
