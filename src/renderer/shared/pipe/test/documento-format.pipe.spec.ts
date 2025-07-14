import { DocumentoFormatPipe } from "../documento-format.pipe";

describe("DocumentoFormatPipe", () => {

    let documentoFormatPipe = new DocumentoFormatPipe();

    it('should not format if value is undefined', () => {
        expect(documentoFormatPipe.transform(undefined)).toBeUndefined();
        expect(documentoFormatPipe.transform(null)).toBeNull();
    })

    it('should format CPF', () => {
        expect(documentoFormatPipe.transform('11111111111')).toEqual('111.111.111-11');
    })

    it('should format CNPJ', () => {
        expect(documentoFormatPipe.transform('11111111111111')).toEqual('11.111.111/1111-11');
    })

})