import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = 140): string {
    const v = (value ?? '').trim();
    if (!v) return '';
    if (v.length <= maxLength) return v;
    return `${v.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
  }
}

