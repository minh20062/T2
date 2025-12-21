const Product = require('../models/Product');

// ✅ Tạo sản phẩm
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product created",
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Lấy tất cả sản phẩm (Filtering + Sorting + Field limiting + Pagination)
exports.getAllProducts = async (req, res, next) => {
  try {
    let queryObj = { ...req.query };

    const excludeFields = ['sort', 'fields', 'page', 'limit'];
    excludeFields.forEach(el => delete queryObj[el]);

    // ✅ Xử lý price[gte], price[lte], price[gt], price[lt]
    Object.keys(queryObj).forEach(key => {
      if (key.includes('[')) {
        const field = key.split('[')[0];
        const operator = key.split('[')[1].replace(']', '');

        if (!queryObj[field]) queryObj[field] = {};
        queryObj[field][`$${operator}`] = queryObj[key];

        delete queryObj[key];
      }
    });

    let query = Product.find(queryObj).populate('categories');

    // ✅ Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort.split(',').join(' '));
    } else {
      query = query.sort('-createdAt');
    }

    // ✅ Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // ✅ Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const products = await query;

    res.status(200).json({
      success: true,
      count: products.length,
      page,
      data: products
    });

  } catch (err) {
    next(err);
  }
};

// ✅ Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};