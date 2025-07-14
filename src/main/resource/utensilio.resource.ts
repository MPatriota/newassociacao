import { IpcClass } from '../annotation/ipc-class';
import { UtensilioRepository } from '../repository/utensilio.repository';
import { IpcMethod } from '../annotation/ipc-method';
import { Utensilio } from '../entity/utensilio.entity';

@IpcClass("utensilio")
export class UtensilioResource {

  constructor(private utensilioRepository: UtensilioRepository) {
  }

  @IpcMethod('findAll')
  async findAll(): Promise<Utensilio[]> {
    return await this.utensilioRepository.findAllUnlimited();
  }

  @IpcMethod('save')
  async save(utensilio: Utensilio) {
    return this.utensilioRepository.save(utensilio);
  }

}
