const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    salary: Float!
    picture: String
  }

  type DeleteEmployeeResponse {
    id: ID!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input EmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    salary: Float!
    picture: String
  }

  type Query {
    employees(department: String, position: String): [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(input: SignupInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): DeleteEmployeeResponse!
  }
`;

module.exports = { typeDefs };
