import User from "../models/user.model.js";

export async function createUser(req, res) {
    try {
        const { firstName, lastName, email, mobileNumber, dob, address, password } = req.body;
        console.log(req.body);

        const createUserResult = await User.createUser(firstName, lastName, email, mobileNumber, dob, address, password);

        if (createUserResult) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(400).json({ message: 'User already exists. Please login.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'User email already exists. Please login to continue' });
    }
}

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
