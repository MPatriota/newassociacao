import { DateFormatPipe } from "../date-format.pipe";

describe("DateFormatPipe", () => {

    let dateFormatPipe = new DateFormatPipe();

    it('should not format if value is undefined', () => {
        expect(dateFormatPipe.transform(undefined)).toBeUndefined();
        expect(dateFormatPipe.transform(null)).toBeNull();
    })

    it('should format date', () => {
        expect(dateFormatPipe.transform(new Date("2025-03-14T23:59:57.748Z"))).toEqual('14/03/2025');
    })
})