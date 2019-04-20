import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  _selectedAccounts: string[];

  set selectedAccounts(value: string[]){
    this._selectedAccounts = value;
    console.log(this._selectedAccounts);
  }

  constructor() { }
}
