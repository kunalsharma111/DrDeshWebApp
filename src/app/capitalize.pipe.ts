import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: String): any {
    var res = value.substring(0, 1).toUpperCase() + value.substr(1);
    return res;
  }

}
