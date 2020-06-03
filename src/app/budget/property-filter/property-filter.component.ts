import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ICheckbox } from '../ICheckbox';
import { TransactiosService } from '../transactions.service';
import { ITransaction } from '../ITransaction';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'pm-property-filter',
  templateUrl: './property-filter.component.html',
  styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent implements OnInit {
  @Input() filterProperty: string;
  @Input() customProperties: ReplaySubject<string[]>;
  @Output() selectedProperties: EventEmitter<string[]> = new EventEmitter<string[]>();
  properties: ICheckbox[];
  errorMessage: string;

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    let self = this;
    if (this.filterProperty) {
      this._transactionsService.getAllTransactions().subscribe(
        transactions => {
          this.properties = _.uniqBy(transactions, this.filterProperty)
                            .map(function(transaction: ITransaction) {
                              return { name: _.get(transaction, self.filterProperty), isChecked: true };
                            })
                            .reverse();
          this.selectedPropertiesChanged(null);
        },
        error => this.errorMessage = error
      );
    }
    if (this.customProperties) {
      this.customProperties.subscribe(
        categories => {
          this.properties = categories.map(function(prop) { return {name: prop, isChecked: true} })
          this.selectedPropertiesChanged(null)
        }
      )
    } 
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
