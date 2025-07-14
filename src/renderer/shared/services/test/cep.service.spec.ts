import { CepService } from "../cep.service";
import { of } from "rxjs";

describe("CepService", () => {

    let cepService: CepService;
    let httpCliente: any;

    beforeEach(() => {
        httpCliente = {
            get: jest.fn(() => of({}))
        }

        cepService = new CepService(httpCliente);
    })

    it('should get cep information', () => {
        cepService.findByCep("87047415");

        expect(httpCliente.get).toHaveBeenCalledTimes(1);
        expect(httpCliente.get).toHaveBeenCalledWith("https://viacep.com.br/ws/87047415/json/");
    })
})
