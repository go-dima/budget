import { PipeTransform, Pipe } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

@Pipe({
    name: "nis_currency"
})
export class AppCurrencyPipe extends CurrencyPipe implements PipeTransform {
    transform(data): string {
        return super.transform(data, 'ILS', 'symbol', '1.2-2');
    }
}