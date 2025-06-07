const pool = require('../db');

class UserController {
    static async createUser(req, res) {
        try {
            let { login, chat_id } = req.body;
            const result = await pool.query('INSERT INTO users (login, chat_id, is_admin) VALUES ($1, $2, FALSE) RETURNING *', [login, chat_id]);
            res.status(200).json({id: result.rows[0].id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getUser(req, res) {
        try {
            const login = req.params.login;
            const result = (await pool.query('SELECT * FROM users WHERE login = $1', [login])).rows[0];
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getAllCarts(req, res) {
        try {
            const user_id = req.params.id;
            console.log(user_id);
            const result = (await pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id])).rows.filter(item => item.is_sent);
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async makeAdmin(req, res) {
        try {
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async removeAdmin(req, res) {
        try {
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = UserController;