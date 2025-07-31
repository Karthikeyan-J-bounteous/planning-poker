import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'abbreviateName',
    standalone: false
})
export class AbbreviateNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const names = value.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2);
    }

    return names.map(name => name.charAt(0)).join('');
  }
}
