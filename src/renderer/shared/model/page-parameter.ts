export class PageParameter {

  constructor(readonly page?: number, readonly limit?: number) {
    this.page = page ?? 1;
    this.limit = limit ?? 10;
  }

}
