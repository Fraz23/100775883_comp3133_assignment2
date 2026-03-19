export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  picture?: string | null;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  picture?: string | null;
}

export interface EmployeeSearchFilter {
  department?: string;
  position?: string;
}
