import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CepApiInformation } from "../model/cep.model";

@Injectable()
export class CepService {

    readonly apiURLTemplate: String = "https://viacep.com.br/ws/cep/json/";

    constructor(
        private httpCliente: HttpClient,
    ) { }

    findByCep(cep: string) {
        return this.httpCliente.get<CepApiInformation>(this.apiURLTemplate.replace('/cep/', `/${cep}/`));
    }
}