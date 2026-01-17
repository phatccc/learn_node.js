const Product = require('../models/Product');


// CREATE (user/admin) - ai login cũng tạo được
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;

        const product = await Product.create({
            name,
            price,
            description,
            stock,
            createBy: req.decode.id // ✅ lấy từ accessToken payload
        })

        res.status(201).json({ message: "Product created successfully", product })

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

// GET ALL
// - admin: thấy tất cả
// - user: thấy sản phẩm của mình\

exports.getAllProduct = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', sort = 'createdAt' } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {
            name: { $regex: search, $options: 'i' }
        }

        if (req.decode.role !== 'admin') {
            filter.createBy = req.decode.id
        }

        const products = await Product.find(filter)
            .sort({ [sort]: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('createBy', 'username role')

        const total = await Product.countDocuments(filter)

        res.json({
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}

// GET BY ID
// - admin: xem được tất cả
// - user: chỉ xem được của mình

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createBy', 'username role')
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const isAdmin = req.decode.role === 'admin'
        const isOwner = req.decode.id === product.createBy._id.toString()

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Forbidden and not owner' })
        }

        res.json(product)

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    }
}

// UPDATE
// - admin: update tất cả
// - user: chỉ update của mình

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const isAdmin = req.decode.role === 'admin'
        const isOwner = product.createBy.toString() === req.decode.id;
        if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Forbidden' });

        const { name, price, description, stock } = req.body;
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (stock !== undefined) product.stock = stock;

        await product.save();

        res.json({ message: 'Updated', product })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

// DELETE
// - admin: delete tất cả
// - user: chỉ delete của mình
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const isOwner = product.createBy.toString() === req.decode.id;
        const isAdmin = req.decode.role === 'admin';
        if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Forbidden' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};