const endpoint = 'http://localhost:4000/graphql';

async function gqlRequest(query, variables = {}, token = '') {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables })
  });

  return response.json();
}

async function run() {
  const loginMutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        token
        user {
          id
          email
        }
      }
    }
  `;

  const loginResult = await gqlRequest(loginMutation, {
    input: {
      email: 'demo_user@example.com',
      password: 'password123'
    }
  });

  if (loginResult.errors || !loginResult.data?.login?.token) {
    console.error('Login failed. Ensure backend is running and demo user exists.');
    console.error(JSON.stringify(loginResult, null, 2));
    process.exit(1);
  }

  const token = loginResult.data.login.token;

  const employees = [
    {
      firstName: 'Ava',
      lastName: 'Patel',
      email: 'ava.patel@company.com',
      department: 'Engineering',
      position: 'Frontend Developer',
      salary: 78000,
      picture: 'https://i.pravatar.cc/150?img=20'
    },
    {
      firstName: 'Noah',
      lastName: 'Kim',
      email: 'noah.kim@company.com',
      department: 'Engineering',
      position: 'Backend Developer',
      salary: 82000,
      picture: 'https://i.pravatar.cc/150?img=12'
    },
    {
      firstName: 'Mia',
      lastName: 'Singh',
      email: 'mia.singh@company.com',
      department: 'Human Resources',
      position: 'HR Specialist',
      salary: 64000,
      picture: 'https://i.pravatar.cc/150?img=47'
    },
    {
      firstName: 'Liam',
      lastName: 'Garcia',
      email: 'liam.garcia@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 71000,
      picture: 'https://i.pravatar.cc/150?img=15'
    },
    {
      firstName: 'Emma',
      lastName: 'Chen',
      email: 'emma.chen@company.com',
      department: 'Marketing',
      position: 'Marketing Coordinator',
      salary: 67000,
      picture: 'https://i.pravatar.cc/150?img=5'
    }
  ];

  const addEmployeeMutation = `
    mutation AddEmployee($input: EmployeeInput!) {
      addEmployee(input: $input) {
        id
        firstName
        lastName
        email
      }
    }
  `;

  for (const employee of employees) {
    const addResult = await gqlRequest(
      addEmployeeMutation,
      { input: employee },
      token
    );

    if (addResult.errors) {
      console.log(`ERROR: ${employee.email} -> ${addResult.errors[0].message}`);
    } else {
      console.log(`ADDED: ${addResult.data.addEmployee.email}`);
    }
  }

  const listQuery = `
    query {
      employees {
        id
      }
    }
  `;

  const listResult = await gqlRequest(listQuery, {}, token);
  const total = listResult.data?.employees?.length ?? 0;
  console.log(`TOTAL EMPLOYEES NOW: ${total}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
