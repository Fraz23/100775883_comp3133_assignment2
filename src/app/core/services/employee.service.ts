import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { gql } from '@apollo/client/core';
import { Employee, EmployeeInput, EmployeeSearchFilter } from '../models/employee.model';

interface EmployeesResponse {
  employees: Employee[];
}

interface EmployeeResponse {
  employee: Employee;
}

interface MutationResponse {
  addEmployee?: Employee;
  updateEmployee?: Employee;
  deleteEmployee?: { id: string };
}

const GET_EMPLOYEES_QUERY = gql`
  query Employees($department: String, $position: String) {
    employees(department: $department, position: $position) {
      id
      firstName
      lastName
      email
      department
      position
      salary
      picture
    }
  }
`;

const GET_EMPLOYEE_QUERY = gql`
  query Employee($id: ID!) {
    employee(id: $id) {
      id
      firstName
      lastName
      email
      department
      position
      salary
      picture
    }
  }
`;

const ADD_EMPLOYEE_MUTATION = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      firstName
      lastName
      email
      department
      position
      salary
      picture
    }
  }
`;

const UPDATE_EMPLOYEE_MUTATION = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      department
      position
      salary
      picture
    }
  }
`;

const DELETE_EMPLOYEE_MUTATION = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apollo = inject(Apollo);

  getEmployees(filter: EmployeeSearchFilter = {}): Observable<Employee[]> {
    return this.apollo
      .watchQuery<EmployeesResponse>({
        query: GET_EMPLOYEES_QUERY,
        variables: {
          department: filter.department || null,
          position: filter.position || null
        },
        fetchPolicy: 'network-only'
      })
      .valueChanges.pipe(map(({ data }) => (data?.employees ?? []) as Employee[]));
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo
      .query<EmployeeResponse>({
        query: GET_EMPLOYEE_QUERY,
        variables: { id },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(({ data }) => {
          if (!data?.employee) {
            throw new Error('Employee not found.');
          }

          return data.employee as Employee;
        })
      );
  }

  addEmployee(input: EmployeeInput): Observable<Employee> {
    return this.apollo
      .mutate<MutationResponse>({
        mutation: ADD_EMPLOYEE_MUTATION,
        variables: { input },
        refetchQueries: [{ query: GET_EMPLOYEES_QUERY }]
      })
      .pipe(
        map(({ data }) => {
          if (!data?.addEmployee) {
            throw new Error('Add employee response is empty.');
          }
          return data.addEmployee;
        })
      );
  }

  updateEmployee(id: string, input: EmployeeInput): Observable<Employee> {
    return this.apollo
      .mutate<MutationResponse>({
        mutation: UPDATE_EMPLOYEE_MUTATION,
        variables: { id, input }
      })
      .pipe(
        map(({ data }) => {
          if (!data?.updateEmployee) {
            throw new Error('Update employee response is empty.');
          }
          return data.updateEmployee;
        })
      );
  }

  deleteEmployee(id: string): Observable<string> {
    return this.apollo
      .mutate<MutationResponse>({
        mutation: DELETE_EMPLOYEE_MUTATION,
        variables: { id },
        refetchQueries: [{ query: GET_EMPLOYEES_QUERY }]
      })
      .pipe(
        map(({ data }) => {
          if (!data?.deleteEmployee?.id) {
            throw new Error('Delete employee response is empty.');
          }
          return data.deleteEmployee.id;
        })
      );
  }
}
