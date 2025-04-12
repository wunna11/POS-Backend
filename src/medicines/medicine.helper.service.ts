import { Injectable } from "@nestjs/common";
import * as moment from "moment";

@Injectable()
export class MedicineHelperService {
  
  isValidDateFormat(date: string) {
    return moment(date, 'DD-MM-YYYY', true).isValid();
  }

  validateDateRange(startDate: string, endDate: string) {
    if (!this.isValidDateFormat(startDate) || !this.isValidDateFormat(endDate)) {
      throw new Error('Invalid date format. Please use DD-MM-YYYY format');
    }
  
    const start = moment(startDate, 'DD-MM-YYYY');
    const end = moment(endDate, 'DD-MM-YYYY');
    
    if (end.isBefore(start)) {
      throw new Error('End date cannot be before start date');
    }
  }
}