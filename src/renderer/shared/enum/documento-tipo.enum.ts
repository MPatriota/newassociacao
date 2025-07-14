export class DocumentoTipo {
    value: string;
    mask: string

    private constructor(value: string, mask: string) {
        this.value = value;
        this.mask = mask;
    }

    public static CPF = new DocumentoTipo('cpf', '999.999.999-99');
    public static CNPJ = new DocumentoTipo('cnpj', '99.999.999/9999-99');
}