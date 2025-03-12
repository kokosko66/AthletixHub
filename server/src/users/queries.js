const getUsers = 'SELECT * FROM Users';
const getUsersByRole = 'SELECT * FROM Users WHERE role = ?';
const getUserById = 'SELECT * FROM Users WHERE id = ?';
const getUserByName = 'SELECT * FROM Users WHERE name = ?';
const getUserByEmail = 'SELECT * FROM Users WHERE email = ?';

const addUser = 'INSERT INTO Users (name, email, password, role, created_at, short_description, family_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
const updateUser = 'UPDATE Users SET name = ?, email = ?, phone = ?, pasword = ?, role = ? WHERE id = ?';
const deleteUser = 'DELETE FROM Users WHERE id = ?';

export const queries = {
    getUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    getUsersByRole,
    addUser,
    updateUser,
    deleteUser,
};