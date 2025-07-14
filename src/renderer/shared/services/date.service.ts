import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable()
export class DateService {
  constructor(

  ) { }

  getCurrentDate() {
    return moment().toDate();
  }

}
