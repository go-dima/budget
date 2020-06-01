import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: "toDisplayClass"
})
export class ConvertToDisplayClassPipe implements PipeTransform {
    transform(data): string {
        if (data > 0) return "text-success"
        if (data < 0 ) return "text-danger"
        return "text-dark"
    }
}