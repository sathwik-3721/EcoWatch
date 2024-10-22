import User from "../models/user.model.js";

// Create a new user
export async function createUser(req, res) {
    try {
        const { firstName, lastName, email, mobileNumber, dob, address, password } = req.body;
        console.log(req.body);

        const createUserResult = await User.createUser(
            firstName, lastName, email, mobileNumber, dob, address, password
        );
        console.log("cres", createUserResult);

        if (createUserResult.affectedRows > 0) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(409).json({ message: 'User already exists. Please login.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user. Please try again.' });
    }
}

// Login a user
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const loginUserResult = await User.validateUserLogin(email, password);

        if (loginUserResult.success) {
            res.status(200).json({ message: loginUserResult.message });
        } else {
            res.status(401).json({ message: loginUserResult.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error, please try again later.' });
    }
}

// Get the user's name by email
export async function getUserName(req, res) {
    try {
        const { email } = req.query;
        const getUserNameResult = await User.getUserName(email);
        console.log('object', getUserNameResult);

        if (getUserNameResult.success) {
            const userName = `${getUserNameResult.result[0].first_name} ${getUserNameResult.result[0].last_name}`;
            console.log('us', userName);
            res.status(200).json({ message: 'success', username: userName });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error, please try again later.' });
    }
}

// Update user password (Forgot Password)
export async function updatePassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        const updateResult = await User.updatePassword(email, newPassword);

        if (updateResult.success) {
            res.status(200).json({ message: 'Password updated successfully.' });
        } else {
            res.status(404).json({ message: updateResult.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error, please try again later.' });
    }
}
