import { poolPromise } from "../utils/dbConnection.js";
import bcrypt from 'bcrypt';

class User {
    // Add a new user to the database
    static async createUser(firstName, lastName, email, mobileNumber, dob, address, password) {
        try {
            const pool = await poolPromise;
            const userExists = await this.validateUser(email);

            if (!userExists) {
                const saltRounds = 9;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const sql = `
                    INSERT INTO Users (first_name, last_name, email, mobile_number, date_of_birth, address, password_hashed)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                const [result] = await pool.query(sql, [firstName, lastName, email, mobileNumber, dob, address, hashedPassword]);
                return result;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Error creating user:", err);
            throw err;
        }
    }

    // Fetch a user by email
    static async getUserByEmail(email) {
        try {
            const pool = await poolPromise;
            const sql = 'SELECT * FROM Users WHERE email = ?';
            const [result] = await pool.query(sql, [email]);

            return result;
        } catch (err) {
            console.error("Error fetching user by email:", err);
            throw err;
        }
    }

    // Validate if a user already exists
    static async validateUser(email) {
        try {
            const result = await this.getUserByEmail(email);
            return result.length === 0;
        } catch (err) {
            console.error("Error validating user:", err);
            throw err;
        }
    }

    // Validate user login credentials
    static async validateUserLogin(email, password) {
        try {
            const pool = await poolPromise;
            const sql = 'SELECT password_hashed FROM Users WHERE email = ?';
            const [result] = await pool.query(sql, [email]);

            if (result.length === 0) {
                console.log("User not found");
                return { success: false, message: "Invalid username or password" };
            }

            const hashedPassword = result[0].password_hashed;
            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (isMatch) {
                console.log("Login successful");
                return { success: true, message: "Login success" };
            } else {
                console.log("Invalid password");
                return { success: false, message: "Invalid login credentials" };
            }
        } catch (err) {
            console.error("Error validating user login:", err);
            return { success: false, message: "Login failed, please try again" };
        }
    }
}

export default User;
