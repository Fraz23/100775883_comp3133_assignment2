import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeInput } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-employee-edit-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.page.html',
  styleUrl: './employees.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeEditPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  protected readonly isEditMode = true;
  protected readonly title = 'Update Employee';
  protected readonly submitLabel = signal('Update Employee');
  protected readonly pageLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly imagePreview = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', [Validators.required]],
    position: ['', [Validators.required]],
    salary: [0, [Validators.required, Validators.min(1)]],
    picture: ['']
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.pageLoading.set(false);
      this.errorMessage.set('Employee id is missing in the route.');
      return;
    }

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.pageLoading.set(false);
        this.form.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          salary: employee.salary,
          picture: employee.picture ?? ''
        });
        this.imagePreview.set(employee.picture ?? null);
      },
      error: (error: unknown) => {
        this.pageLoading.set(false);
        this.errorMessage.set(this.getReadableError(error));
      }
    });
  }

  protected onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Only image files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage.set('Please use an image less than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.imagePreview.set(result || null);
      this.form.controls.picture.setValue(result);
      this.errorMessage.set('');
    };
    reader.readAsDataURL(file);
  }

  protected submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Employee id is missing in the route.');
      return;
    }

    this.submitLabel.set('Saving...');
    const payload = this.form.getRawValue() as EmployeeInput;

    this.employeeService.updateEmployee(id, payload).subscribe({
      next: () => {
        this.submitLabel.set('Update Employee');
        this.router.navigateByUrl('/employees');
      },
      error: (error: unknown) => {
        this.submitLabel.set('Update Employee');
        this.errorMessage.set(this.getReadableError(error));
      }
    });
  }

  private getReadableError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }
    return 'Unable to update employee right now. Please try again.';
  }
}
