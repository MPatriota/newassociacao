import { IpcClass } from '../annotation/ipc-class';
import { StatService } from '../service/stat.service';
import { IpcMethod } from '../annotation/ipc-method';

@IpcClass("stat")
export class StatResource {

  constructor(private statService: StatService) {
  }

  @IpcMethod("get")
  async getStats(): Promise<{
    totalVenda: number,
    totalContasAReceber: number,
    totalContasPagar: number
  }> {
    return await this.statService.getStats();
  }

}

