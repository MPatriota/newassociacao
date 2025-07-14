import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform{
    transform(value?: number | null): any {
        if(value === null || value === undefined){
          value = 0;
        }

        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    }
}
