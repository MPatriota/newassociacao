import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
    name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform{
    transform(time?: string | Date): any {
        if(!time){
            return time;
        }

        return moment(time, "HH:mm").format("HH:mm");
    }
}
