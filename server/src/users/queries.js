const getUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id = $1';
const getUserByName = 'SELECT * FROM users WHERE name = $1';
const getUserByEmail = 'SELECT * FROM users WHERE email = $1';

const addUser = 'INSERT INTO users (name, email, phone, pasword, role, created_at) VALUES ($1, $2, $3, $4, $5, $6)';
const updateUser = 'UPDATE users SET name = $1, email = $2, phone = $3, pasword = $4, role = $5 WHERE id = $6';
const deleteUser = 'DELETE FROM users WHERE id = $1';

export const queries = {
    getUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
};