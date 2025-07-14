import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform{
    transform(date?: string | Date | null): any {
        if(!date){
            return date;
        }

        return moment(date).format("DD/MM/YYYY");
    }
}
