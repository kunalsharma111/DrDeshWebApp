import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipeFilter'
})
export class SearchPipeFilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      if (args[0] != undefined && val.overtimes != undefined) {
        let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.overtimes.period.toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.overtimes.hour.includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) || val.overtimes.status.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          new Date(val.overtimes.savedon).toLocaleDateString().toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
        return rVal;
      } else if (args[0] != undefined && val.lectures != undefined) {
        let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.lectures.period.toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.lectures.amount.includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) || val.lectures.status.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          new Date(val.lectures.savedon).toLocaleDateString().toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
        return rVal;
      } else if (args[0] != undefined && val.receipts != undefined) {
        if (val.receipts.period != undefined && val.receipts.amount != undefined) {
          let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            val.receipts.period.toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            val.receipts.amount.includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) || val.receipts.status.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            new Date(val.receipts.savedon).toLocaleDateString().toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
          return rVal;
        } else if (val.receipts.period == undefined && val.receipts.amount != undefined) {
          let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            val.receipts.amount.includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) || val.receipts.status.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            new Date(val.receipts.savedon).toLocaleDateString().toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
          return rVal;
        } else if (val.receipts.period != undefined && val.receipts.amount == undefined) {
          let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            val.receipts.period.toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            val.receipts.status.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            new Date(val.receipts.savedon).toLocaleDateString().toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
          return rVal;
        } else {
          let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            val.receipts.status.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
            new Date(val.receipts.savedon).toLocaleDateString().toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
          return rVal;
        }
      } else if (args[0] != undefined && val.Vacations != undefined) {
        let rVal = (val.fname.toLocaleLowerCase() + val.lname.toLocaleLowerCase()).includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.Vacations.vacationStatus.toLocaleLowerCase().includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.Vacations.vacationFrom.toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, "")) ||
          val.Vacations.vacationTo.toLocaleLowerCase().replace(/\s*/g, "").includes(args[0].toLocaleLowerCase().replace(/\s*/g, ""));
        return rVal;
      } else {
        return val;
      }
    })
  }

}
