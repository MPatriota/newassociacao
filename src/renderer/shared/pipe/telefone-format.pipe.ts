import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'telefoneFormat'
})
export class TelefoneFormatPipe implements PipeTransform{
    transform(telefone?: string | null): any {
        if(!telefone){
            return telefone;
        }

        let telefoneLength = telefone.length;

        if(telefoneLength == 11) {
            return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
        }

        return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6, 10)}`;
    }
}