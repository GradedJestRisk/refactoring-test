const userRepository = require('../infrastructure/managed-dependencies/user-repository')
const companyRepository = require('../infrastructure/managed-dependencies/company-repository')
const User = require('../domain/User');
const Company = require('../domain/Company');

const getUser = function (user

const userData = await userRepository.getUserById(id);
const user = new User(userData);

module.exports = { createUser }