import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';

@Component({
  selector: 'app-employee-details-page',
  imports: [RouterLink, FullNamePipe],
  templateUrl: './employee-details.page.html',
  styleUrl: './employees.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly employee = signal<Employee | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('Employee id is missing in the route.');
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.loading.set(false);
        this.employee.set(employee);
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
    return 'Unable to load employee details right now.';
  }
}
