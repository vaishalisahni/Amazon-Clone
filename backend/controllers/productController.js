const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products (with search & filter)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;
  const { keyword, category, minPrice, maxPrice, minRating } = req.query;

  const filter = {};
  if (keyword) {
    filter.$or = [
      { product_name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
    ];
  }
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.numericPrice = {};
    if (minPrice) filter.numericPrice.$gte = Number(minPrice);
    if (maxPrice) filter.numericPrice.$lte = Number(maxPrice);
  }
  if (minRating) filter.rating = { $gte: Number(minRating) };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { product_id: req.params.id }],
  }).populate('reviews.user', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    product_name: req.body.product_name || 'Sample Product',
    category: req.body.category || 'Electronics',
    img_link: req.body.img_link || 'https://via.placeholder.com/300',
    discounted_price: req.body.discounted_price || '₹999',
    numericPrice: req.body.numericPrice || 999,
    about_product: req.body.about_product || '',
    countInStock: req.body.countInStock || 10,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  product.rating_count = String(product.reviews.length);

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };