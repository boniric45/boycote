import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateCabin',
})
export class TruncateCabinPipe implements PipeTransform {

  transform(value: string, limit = 35, ellipsis = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
