import { TipoProduto } from "./produto.model";
import { Tag } from "./tag.model";

export interface FilterState {
  valorMinimo: { value:  number | null, callback: Function },
  valorMaximo: { value:  number | null, callback: Function },
  estoqueMinimo: { value:  number | null, callback: Function },
  estoqueMaximo: { value:  number | null, callback: Function },
  types: { value: TipoProduto[], callback: Function };
  tags: { value: Tag[], callback: Function };
}
