import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: "convertToSapces"
})
export class ConvertToSpacesPipe implements PipeTransform {
    transform(value: string, charachter: string) {
        return value.replace(charachter, ' ');
    }
}