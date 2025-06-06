const pool = require('../db');

class CartController {
    static async createCart(req, res) {
        try {
            let {user_id} = req.body;
            const result = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [user_id]);
            res.status(200).json({id: result.rows[0].id});
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async getCart(req, res) {
        try {
            const cart_id = req.params.id;
            const result = (await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cart_id])).rows;
            for (let item of result) {
                const tempType = (await pool.query('SELECT * FROM product_types WHERE id = $1', [item.product_type_id])).rows[0];
                const tempProd = (await pool.query('SELECT * FROM products WHERE id = $1', [tempType.product_id])).rows[0];
                console.log(tempProd);
                item.image = tempProd.image_url;
                item.name = tempProd.name;
                item.price = tempProd.price;
                item.type = tempType.type;
            }
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async addToCart(req, res) {
        try {
            let { cart_id, product_type_id, quantity } = req.body;
            const result = (await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cart_id])).rows;
            const found = result.find((item) => item.product_type_id === product_type_id);
            const amount = (await pool.query('SELECT amount FROM product_types WHERE id = $1', [product_type_id])).rows[0].amount;
            console.log(amount, cart_id, product_type_id, quantity);
            if (quantity > amount) {
                res.status(200).json({ success: false });
                return;
            }
            if (found) {
                const result = (await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *', [quantity + found.quantity, found.id])).rows;
                console.log(result);
            } else {
                const result = (await pool.query('INSERT INTO cart_items (cart_id, product_type_id, quantity) VALUES ($1, $2, $3) RETURNING *', [cart_id, product_type_id, quantity])).rows;
                console.log(result);
            }
            await pool.query('UPDATE product_types SET amount = $1 WHERE id = $2', [amount - quantity, product_type_id]);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async deleteFromCart(req, res) {
        try {
            let { cart_id, product_type_id } = req.body;
            const quantity = (await pool.query('SELECT quantity FROM cart_items WHERE cart_id = $1 AND product_type_id = $2', [cart_id, product_type_id])).rows[0].quantity;
            await pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_type_id = $2', [cart_id, product_type_id]);
            const amount = (await pool.query('SELECT amount FROM product_types WHERE id = $1', [product_type_id])).rows[0].amount;
            await pool.query('UPDATE product_types SET amount = $1 WHERE id = $2', [amount + quantity, product_type_id]);
            console.log(quantity, amount);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async clearCart(req, res) {
        try {
            let { cart_id } = req.body;
            await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart_id]);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
    static async deleteCart(req, res) {
        try {
            const { cart_id } = req.body;
            await pool.query('DELETE FROM carts WHERE id = $1', [cart_id]);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = CartController;