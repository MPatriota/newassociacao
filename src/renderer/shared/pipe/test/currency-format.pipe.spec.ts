import { CurrencyFormatPipe } from "../currency-format.pipe";

describe("CurrencyFormatPipe", () => {

    let currencyFormatPipe = new CurrencyFormatPipe();

    it('should not format if value is undefined', () => {
        expect(currencyFormatPipe.transform(undefined)).toEqual("R$ 0,00");
        expect(currencyFormatPipe.transform(null)).toEqual("R$ 0,00");
    })

    it('should format to currency', () => {
        expect(currencyFormatPipe.transform(15.05)).toEqual("R$ 15,05");
    })

})
