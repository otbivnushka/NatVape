const pool = require('../db');

class ProductController {
    static async createProduct(req, res) {
        try {
            let body = req.body;
            const result = await pool.query('INSERT INTO products (category_id, name, price, image_url) VALUES ($1, $2, $3, $4)', [body.category_id, body.name, body.price, body.image_url]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getProduct(req, res) {
        try {
            const id = req.params.id;

            const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
            const output = productResult.rows[0];

            if (!output) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const typesResult = await pool.query('SELECT * FROM product_types WHERE product_id = $1', [id]);
            output.product_types = typesResult.rows;

            res.status(200).json(output);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getAllProduct(req, res) {
        try {
            const category_id = req.query.category_id || '';
            const result = await pool.query('SELECT * FROM products WHERE category_id = $1', [category_id]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async updateProduct(req, res) {
        try {
            const body = req.body;
            const result = await pool.query('UPDATE products SET category_id = $1, name = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *', [body.category_id, body.name, body.price, body.image_url, body.id]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async deleteProduct(req, res) {
        try {
            const id = req.body.id;
            const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async deleteProductType(req, res) {
        try {

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = ProductController;