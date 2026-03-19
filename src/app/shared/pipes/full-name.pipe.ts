import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../../core/models/employee.model';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {
  transform(employee: Pick<Employee, 'firstName' | 'lastName'>): string {
    return `${employee.firstName} ${employee.lastName}`.trim();
  }
}
