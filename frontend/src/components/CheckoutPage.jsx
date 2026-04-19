import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../utils/cartSlice';
import ProductImage from './ProductImage';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry'];

const STEPS = ['Address', 'Payment', 'Review'];

// Validation helpers
const validators = {
  name: (v) => {
    if (!v.trim()) return 'Full name is required.';
    if (v.trim().length < 3) return 'Name must be at least 3 characters.';
    if (!/^[a-zA-Z\s.'-]+$/.test(v.trim())) return 'Name can only contain letters, spaces, and hyphens.';
    return '';
  },
  phone: (v) => {
    if (!v.trim()) return 'Mobile number is required.';
    if (!/^\d{10}$/.test(v.trim())) return 'Enter a valid 10-digit mobile number.';
    return '';
  },
  house: (v) => {
    if (!v.trim()) return 'Flat/House number is required.';
    if (v.trim().length < 3) return 'Please provide a complete address.';
    return '';
  },
  area: (v) => {
    if (!v.trim()) return 'Area/Street is required.';
    if (v.trim().length < 5) return 'Please provide a complete street address.';
    return '';
  },
  city: (v) => {
    if (!v.trim()) return 'City/Town is required.';
    if (v.trim().length < 2) return 'Please enter a valid city name.';
    if (!/^[a-zA-Z\s.-]+$/.test(v.trim())) return 'City name should only contain letters.';
    return '';
  },
  pincode: (v) => {
    if (!v.trim()) return 'Pincode is required.';
    if (!/^\d{6}$/.test(v.trim())) return 'Enter a valid 6-digit pincode.';
    // Basic Indian pincode validation (starts with 1-9)
    if (v[0] === '0') return 'Enter a valid Indian pincode.';
    return '';
  },
};

function CheckoutPage() {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({
    name: '', phone: '', house: '', area: '', city: '', state: 'Delhi', pincode: ''
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [addressTouched, setAddressTouched] = useState({});

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  // Pre-fill from saved addresses if available
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.name) setAddress(prev => ({ ...prev, name: user.name }));
      } catch {}
    }
  }, []);

  const shippingPrice = totalAmount > 499 ? 0 : 40;
  const finalTotal = totalAmount + shippingPrice;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    setAddressTouched(prev => ({ ...prev, [name]: true }));
    if (validators[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const handleAddressBlur = (e) => {
    const { name, value } = e.target;
    setAddressTouched(prev => ({ ...prev, [name]: true }));
    if (validators[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const validateAllAddress = () => {
    const errors = {};
    const touched = {};
    ['name', 'phone', 'house', 'area', 'city', 'pincode'].forEach((field) => {
      errors[field] = validators[field](address[field]);
      touched[field] = true;
    });
    setAddressErrors(errors);
    setAddressTouched(touched);
    return Object.values(errors).every((e) => !e);
  };

  const validateUPI = () => {
    if (paymentMethod === 'UPI' && upiId) {
      if (!/^[\w.-]+@[\w]+$/.test(upiId)) {
        setUpiError('Enter a valid UPI ID (e.g., name@upi)');
        return false;
      }
    }
    return true;
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        product: item._id || null,
        product_id: item.product_id,
        product_name: item.product_name,
        img_link: item.img_link,
        discounted_price: item.discounted_price,
        numericPrice: item.itemPrice,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: totalAmount,
        shippingPrice,
        totalPrice: finalTotal,
      });

      dispatch(clearCart());
      setOrderId(data._id);
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const FieldError = ({ field }) =>
    addressTouched[field] && addressErrors[field] ? (
      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
        {addressErrors[field]}
      </p>
    ) : null;

  const inputClass = (field) =>
    `w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 ${
      addressTouched[field] && addressErrors[field]
        ? 'border-red-400 focus:ring-red-300 bg-red-50'
        : 'border-gray-300 focus:ring-[#febd69] focus:border-[#febd69]'
    }`;

  // Success screen
  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-1">Thank you for your order. We'll send you a confirmation soon.</p>
        <p className="text-sm text-gray-500 mb-2">Order ID: <span className="font-mono font-medium text-gray-700">{orderId}</span></p>
        <p className="text-sm text-gray-500 mb-8">
          Estimated delivery: <span className="font-medium">
            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
            {' – '}
            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
          </span>
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/orders')} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-6 rounded-full text-sm">
            Track Order
          </button>
          <button onClick={() => navigate('/')} className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-medium mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-sm font-medium ${i === step ? 'text-[#c45500]' : i < step ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-[#febd69] text-black' : i < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-200 p-6">

          {/* Step 0: Address */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-medium mb-1">Delivery Address</h2>
              <p className="text-xs text-gray-500 mb-4">All fields marked are required for delivery</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                    placeholder="As it appears on official documents"
                    className={inputClass('name')}
                    autoComplete="name"
                  />
                  <FieldError field="name" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <span className="flex items-center px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l text-sm text-gray-500">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      onBlur={handleAddressBlur}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`flex-1 border rounded-r p-2 text-sm focus:outline-none focus:ring-1 ${addressTouched.phone && addressErrors.phone ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-300 focus:ring-[#febd69]'}`}
                      autoComplete="tel"
                    />
                  </div>
                  <FieldError field="phone" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Pincode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className={inputClass('pincode')}
                  />
                  <FieldError field="pincode" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Flat/House No., Building Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="house"
                    value={address.house}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                    placeholder="e.g. Flat 4B, Sunrise Apartments"
                    className={inputClass('house')}
                    autoComplete="address-line1"
                  />
                  <FieldError field="house" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Area, Street, Sector, Village <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="area"
                    value={address.area}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                    placeholder="e.g. Sector 15, Rohini"
                    className={inputClass('area')}
                    autoComplete="address-line2"
                  />
                  <FieldError field="area" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Town/City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                    placeholder="e.g. New Delhi"
                    className={inputClass('city')}
                    autoComplete="address-level2"
                  />
                  <FieldError field="city" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">State <span className="text-red-500">*</span></label>
                  <select
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69] bg-white"
                  >
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  if (validateAllAddress()) setStep(1);
                  else toast.error('Please fix the errors in the form before continuing.');
                }}
                className="mt-6 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm"
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay with cash when your order is delivered', icon: '💵' },
                  { id: 'UPI', label: 'UPI', desc: 'GPay, PhonePe, Paytm, BHIM UPI', icon: '📱' },
                  { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay, Maestro', icon: '💳' },
                  { id: 'NetBanking', label: 'Net Banking', desc: 'All major banks supported', icon: '🏦' },
                ].map((pm) => (
                  <div key={pm.id}>
                    <label className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === pm.id ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => { setPaymentMethod(pm.id); setUpiError(''); }}
                        className="accent-[#febd69]"
                      />
                      <span className="text-2xl">{pm.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{pm.label}</p>
                        <p className="text-xs text-gray-500">{pm.desc}</p>
                      </div>
                    </label>

                    {/* UPI ID input */}
                    {pm.id === 'UPI' && paymentMethod === 'UPI' && (
                      <div className="mt-2 ml-4 pl-4 border-l-2 border-[#febd69]">
                        <label className="text-xs font-medium text-gray-700 block mb-1">UPI ID (optional for demo)</label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                          className={`w-full max-w-xs border rounded p-2 text-sm focus:outline-none focus:ring-1 ${upiError ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-[#febd69]'}`}
                        />
                        {upiError && <p className="text-red-600 text-xs mt-1">{upiError}</p>}
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          ℹ️ Demo mode: UPI payment will be recorded but not processed.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {(paymentMethod === 'Card' || paymentMethod === 'NetBanking') && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                  ℹ️ Payment gateway not integrated in this demo. Your order will be placed as payment pending.
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  onClick={() => {
                    if (validateUPI()) setStep(2);
                  }}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm"
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Review Your Order</h2>

              {/* Address summary */}
              <div className="bg-gray-50 rounded-md p-4 mb-4 text-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-gray-700">📍 Delivering to:</p>
                  <button onClick={() => setStep(0)} className="text-[#007185] hover:underline text-xs">Change</button>
                </div>
                <p className="font-semibold">{address.name}</p>
                <p className="text-gray-600">{address.house}, {address.area}</p>
                <p className="text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
                <p className="text-gray-600">📞 +91 {address.phone}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-md p-4 mb-4 text-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-700">💳 Payment:</p>
                    <p className="text-gray-600 mt-0.5">
                      {paymentMethod === 'COD' ? '💵 Cash on Delivery' :
                       paymentMethod === 'UPI' ? `📱 UPI${upiId ? ` (${upiId})` : ''}` :
                       paymentMethod === 'Card' ? '💳 Credit/Debit Card' : '🏦 Net Banking'}
                    </p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#007185] hover:underline text-xs">Change</button>
                </div>
              </div>

              {/* Items */}
              <h3 className="font-medium text-sm text-gray-700 mb-2">Order Items ({items.reduce((a, i) => a + i.quantity, 0)}):</h3>
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 border border-gray-100 rounded-md p-3 bg-gray-50">
                    <div className="w-14 h-14 bg-white flex-shrink-0 rounded border border-gray-200">
                      <ProductImage src={item.img_link} alt={item.product_name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1 font-medium">{item.product_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {item.discounted_price}</p>
                    </div>
                    <p className="font-bold text-sm flex-shrink-0">₹{item.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Items total</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery charges</span>
                    <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-amber-300">
                    <span>Order Total</span>
                    <span className="text-red-700">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50">
                  ← Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {placing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    '✓ Place Your Order'
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                By placing your order, you agree to Amazon's{' '}
                <span className="text-[#007185] cursor-pointer hover:underline">privacy notice</span> and{' '}
                <span className="text-[#007185] cursor-pointer hover:underline">conditions of use</span>.
              </p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-[#c45500]">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({items.reduce((a, i) => a + i.quantity, 0)})</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              {shippingPrice > 0 && (
                <p className="text-xs text-gray-400">Add ₹{(499 - totalAmount).toLocaleString('en-IN')} more for FREE delivery</p>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-base text-red-700">
                <span>Order Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {step === 2 && (
              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-bold py-2.5 rounded-full text-sm disabled:opacity-60"
              >
                {placing ? 'Placing...' : 'Place Order'}
              </button>
            )}

            <div className="mt-4 pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-600 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                Secure checkout
              </div>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                10-day easy returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;