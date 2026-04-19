const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, unique: true },
    product_name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    brand: { type: String, default: '' },
    description: { type: String, default: '' },
    about_product: { type: String, default: '' },
    img_link: { type: String, required: true },
    images: [{ type: String }],
    discounted_price: { type: String, required: true },
    actual_price: { type: String },
    discount_percentage: { type: String },
    numericPrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    rating_count: { type: String, default: '0' },
    reviews: [reviewSchema],
    countInStock: { type: Number, default: 100 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text search index
productSchema.index({ product_name: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);