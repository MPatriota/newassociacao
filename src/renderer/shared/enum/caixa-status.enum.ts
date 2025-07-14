export class CaixaStatus {
  private constructor(
    readonly value: number,
    readonly descricao: string
  ) { }

  public static ABERTO = new CaixaStatus(1, 'Aberto');
  public static FECHADO = new CaixaStatus(2, 'Fechado');

  get isAberto() {
    return this.value === CaixaStatus.ABERTO.value;
  }

  get isFechado() {
    return this.value === CaixaStatus.FECHADO.value;
  }

  equals(caixaStatus: CaixaStatus) {
    return this.value === caixaStatus.value;
  }
}
