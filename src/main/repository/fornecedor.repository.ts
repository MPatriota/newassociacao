import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';
import { Fornecedor } from "../entity/fornecedor.entity";

@Injectable()
export class FornecedorRepository extends AbstractRepository<Fornecedor> {

  constructor() {
    super(Fornecedor);
  }

  public emailExists(email: string, excludeId?: number) {
    return this.repository.createQueryBuilder("fornecedor")
        .where('fornecedor.email = :email', {email})
        .andWhere(":excludeId IS NULL OR id <> :excludeId", {excludeId})
        .getExists();
  }
}