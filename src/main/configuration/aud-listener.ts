import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  QueryRunner,
  RemoveEvent,
  UpdateEvent
} from 'typeorm';
import { UsuarioContext } from '../context/UsuarioContext';

enum RevType {
  CREATED = 0,
  UPATED = 1,
  DELETED = 2,
}

@EventSubscriber()
export class AudSubscriber implements EntitySubscriberInterface {

  async afterInsert(event: InsertEvent<any>) {
    await this.registerAud(event, RevType.CREATED);
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.registerAud(event, RevType.UPATED);
  }

  async afterSoftRemove(event: RemoveEvent<any>) {
    await this.registerAud(event, RevType.DELETED);
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.registerAud(event, RevType.DELETED);
  }

  private async registerAud(event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>, revType: RevType) {
    let metadata = event.metadata;

    const mapeamento: {[key: string]: any} = {};

    if(RevType.DELETED == revType) {
      mapeamento['id'] = (event as RemoveEvent<any>).entityId;
    } else {
      metadata.columns.forEach(column => {
        const audValue = event.entity[column.propertyName];

        if(audValue == null) return

        if (column.referencedColumn) {
          mapeamento[column.databaseName] = audValue[column.referencedColumn.propertyName]
        } else {
          if(audValue instanceof Date) {
            mapeamento[column.databaseName] = `'${audValue.toISOString().slice(0, 19).replace('T', ' ')}'`;
          } else if (typeof audValue == 'string') {
            mapeamento[column.databaseName] = `'${audValue}'`
          } else {
            mapeamento[column.databaseName] = audValue
          }
        }
      })
    }

    mapeamento['rev_type'] = revType;
    mapeamento['user_id'] = UsuarioContext.instance.id;

    const tableAudName = metadata.tableName + '_aud';
    const columnsToInsert = Object.keys(mapeamento)
        .map(column => `"${column}"`)
        .join(',');
    const valuesToInsert = Object.values(mapeamento).join(',');

    await event.connection.query(`insert into ${tableAudName} (${columnsToInsert}) VALUES (${valuesToInsert})`)
  }


}
