const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');
const { createToken, requireAuth } = require('../utils/auth');

const resolvers = {
  Query: {
    employees: async (_, args, context) => {
      requireAuth(context);

      const query = {};
      if (args.department) {
        query.department = { $regex: args.department, $options: 'i' };
      }
      if (args.position) {
        query.position = { $regex: args.position, $options: 'i' };
      }

      return Employee.find(query).sort({ createdAt: -1 });
    },

    employee: async (_, { id }, context) => {
      requireAuth(context);
      return Employee.findById(id);
    }
  },

  Mutation: {
    signup: async (_, { input }) => {
      const existing = await User.findOne({ email: input.email.toLowerCase() });
      if (existing) {
        throw new Error('Email is already registered.');
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const user = await User.create({
        username: input.username,
        email: input.email.toLowerCase(),
        password: passwordHash
      });

      const token = createToken(user);

      return {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email
        }
      };
    },

    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email.toLowerCase() });
      if (!user) {
        throw new Error('Invalid email or password.');
      }

      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password.');
      }

      const token = createToken(user);

      return {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email
        }
      };
    },

    addEmployee: async (_, { input }, context) => {
      requireAuth(context);
      return Employee.create(input);
    },

    updateEmployee: async (_, { id, input }, context) => {
      requireAuth(context);

      const employee = await Employee.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true
      });

      if (!employee) {
        throw new Error('Employee not found.');
      }

      return employee;
    },

    deleteEmployee: async (_, { id }, context) => {
      requireAuth(context);

      const employee = await Employee.findByIdAndDelete(id);
      if (!employee) {
        throw new Error('Employee not found.');
      }

      return { id: employee._id.toString() };
    }
  }
};

module.exports = { resolvers };
