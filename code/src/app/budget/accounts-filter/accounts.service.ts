import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  _selectedAccounts: string[];
  accountsChanged: EventEmitter<void> = new EventEmitter<void>();

  get selectedAccounts(): string[] {
      return this._selectedAccounts;
  }

  set selectedAccounts(value: string[]){
    this._selectedAccounts = value;
    this.accountsChanged.emit();
  }

  constructor() { }
}
