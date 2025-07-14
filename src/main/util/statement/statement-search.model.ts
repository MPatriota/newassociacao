export type StatementSearchModel = {
  statement?: string;
  children: StatementChildSearchModel[];
}

export type StatementChildSearchModel= {
  statement: string;
  alias: string;
  children?: StatementChildSearchModel[];
}
