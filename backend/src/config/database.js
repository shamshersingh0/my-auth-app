const bcryptjs = require('bcryptjs');

const users = [
  { 
    id: 1, 
    email: 'user@example.com', 
    password: bcryptjs.hashSync('password123', 10) 
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: bcryptjs.hashSync('admin123', 10)
  }
];

const findUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

const findUserById = (id) => {
  return users.find(u => u.id === id);
};

module.exports = {
  users,
  findUserByEmail,
  findUserById
};
