import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'documentoFormat'
})
export class DocumentoFormatPipe implements PipeTransform{
    transform(documento?: string | null): any {
        if(!documento){
            return documento;
        }

        let documentoLength = documento.length;

        if(documentoLength == 14) {
            return `${documento.slice(0, 2)}.${documento.slice(2, 5)}.${documento.slice(5, 8)}/${documento.slice(8, 12)}-${documento.slice(12, 14)}`;
        }

        return `${documento.slice(0, 3)}.${documento.slice(3, 6)}.${documento.slice(6, 9)}-${documento.slice(9, 12)}`;
    }
}
