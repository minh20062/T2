const Product = require('../models/Product');

// ✅ Tạo sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created", data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Lấy tất cả sản phẩm (Filtering + Sorting + Field limiting + Pagination)
exports.getAllProducts = async (req, res) => {
  try {

    // -----------------------------
    // ✅ 1. Filtering
    // -----------------------------
    let queryObj = { ...req.query };

    const excludeFields = ['sort', 'fields', 'page', 'limit'];
    excludeFields.forEach(el => delete queryObj[el]);

    // ✅ Tự xử lý price[gte], price[lte], price[gt], price[lt]
    Object.keys(queryObj).forEach(key => {
      if (key.includes('[')) {
        const field = key.split('[')[0];      // price
        const operator = key.split('[')[1].replace(']', ''); // gte

        if (!queryObj[field]) queryObj[field] = {};
        queryObj[field][`$${operator}`] = queryObj[key];

        delete queryObj[key];
      }
    });

    let query = Product.find(queryObj).populate('categories');

    // -----------------------------
    // ✅ 2. Sorting
    // -----------------------------
    if (req.query.sort) {
      query = query.sort(req.query.sort.split(',').join(' '));
    } else {
      query = query.sort('-createdAt');
    }

    // -----------------------------
    // ✅ 3. Field limiting
    // -----------------------------
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // -----------------------------
    // ✅ 4. Pagination
    // -----------------------------
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // -----------------------------
    // ✅ 5. Execute query
    // -----------------------------
    const products = await query;

    res.status(200).json({
      success: true,
      count: products.length,
      page,
      data: products
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};