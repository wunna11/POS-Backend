import { Injectable } from "@nestjs/common";
import * as moment from "moment";

@Injectable()
export class MedicineHelperService {

  isValidDateFormat(date: string) {
    const checkFormat = moment(date, 'DD-MM-YYYY', true).isValid();
    if (!checkFormat) {
      throw new Error('Invalid date format. Please use DD-MM-YYYY format');
    }
    return;
  }

  validateDateRange(startDate: string, endDate: string) {
    this.isValidDateFormat(startDate);
    this.isValidDateFormat(endDate);

    const start = moment(startDate, 'DD-MM-YYYY');
    const end = moment(endDate, 'DD-MM-YYYY');

    if (end.isBefore(start)) {
      throw new Error('End date cannot be before start date');
    }
  }
}