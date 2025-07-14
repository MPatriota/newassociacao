import { Cliente } from '../entity/cliente.entity';
import { Injectable } from '../annotation/injectable';
import { AbstractRepository } from './repository';

@Injectable()
export class ClienteRepository extends AbstractRepository<Cliente> {

  constructor() {
    super(Cliente);
  }

}