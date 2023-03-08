import { Pipe, PipeTransform } from '@angular/core';

// usage example in html: {{ somedataWithUnderScore | replace: '_' : ' '}}

@Pipe({name: 'replace'})
export class ReplacePipe implements PipeTransform {
  transform(value: string, existing: string, latest: string): string {
    return  value.replace(new RegExp('\\'+existing, 'g'), latest);
  }
}