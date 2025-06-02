const pool = require('../db');

class ProductService {
    static async create(data) {
        const result = await pool.query('INSERT INTO products (category_id, name, price, image_url) VALUES ($1, $2, $3, $4)', [data.category_id, data.name, data.price, data.image_url]);
        return result.rows[0];
    }
}

module.exports = ProductService;
