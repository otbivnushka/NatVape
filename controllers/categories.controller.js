const pool = require('../db');

class CategoriesController {
    static async createCategory(req, res) {
        try {
            let name = req.body.name;
            let image_url = req.body.image_url;
            const result = await pool.query('INSERT INTO categories (name, image_url) VALUES ($1, $2)', [name, image_url]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getAllCategory(req, res) {
        try {
            const result = await pool.query('SELECT * FROM categories');
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async deleteCategory(req, res) {
        try {
            let id = req.body.id;
            const result = await pool.query('DELETE FROM categories WHERE id = $1;', [id]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = CategoriesController;