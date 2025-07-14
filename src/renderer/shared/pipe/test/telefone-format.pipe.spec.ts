import { TelefoneFormatPipe } from "../telefone-format.pipe";

describe("TelefoneFormatPipe", () => {

    let telefoneFormatPipe = new TelefoneFormatPipe();

    it('should not format if value is undefined', () => {
        expect(telefoneFormatPipe.transform(undefined)).toBeUndefined();
        expect(telefoneFormatPipe.transform(null)).toBeNull();
    })

    it('should format móvel', () => {
        expect(telefoneFormatPipe.transform('11111111111')).toEqual('(11) 11111-1111');
    })

    it('should format fixo', () => {
        expect(telefoneFormatPipe.transform('1111111111')).toEqual('(11) 1111-1111');
    })

})