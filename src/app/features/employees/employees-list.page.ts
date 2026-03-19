import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';

@Component({
  selector: 'app-employees-list-page',
  imports: [RouterLink, ReactiveFormsModule, FullNamePipe],
  templateUrl: './employees-list.page.html',
  styleUrl: './employees.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesListPage {
  private readonly employeeService = inject(EmployeeService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly employees = signal<Employee[]>([]);

  protected readonly searchForm = this.fb.nonNullable.group({
    department: [''],
    position: ['']
  });

  constructor() {
    this.loadEmployees();
  }

  protected search(): void {
    const filter = this.searchForm.getRawValue();
    this.loadEmployees(filter);
  }

  protected clearSearch(): void {
    this.searchForm.reset({ department: '', position: '' });
    this.loadEmployees();
  }

  protected deleteEmployee(id: string): void {
    const shouldDelete = confirm('Are you sure you want to delete this employee?');
    if (!shouldDelete) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees(this.searchForm.getRawValue());
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.getReadableError(error));
      }
    });
  }

  private loadEmployees(filter: { department?: string; position?: string } = {}): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.employeeService.getEmployees(filter).subscribe({
      next: (employees) => {
        this.loading.set(false);
        this.employees.set(employees);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(this.getReadableError(error));
      }
    });
  }

  private getReadableError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }
    return 'Unable to process employee data right now. Please try again.';
  }
}
