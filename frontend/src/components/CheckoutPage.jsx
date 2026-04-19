import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../utils/cartSlice';
import ProductImage from './ProductImage';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry'];

const STEPS = ['Address', 'Payment', 'Review'];

function CheckoutPage() {
  const { items, totalAmount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({ name: '', phone: '', house: '', area: '', city: '', state: 'Delhi', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shippingPrice = totalAmount > 499 ? 0 : 40;
  const finalTotal = totalAmount + shippingPrice;

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const validateAddress = () => {
    const { name, phone, house, area, city, pincode } = address;
    if (!name || !phone || !house || !area || !city || !pincode) {
      toast.error('Please fill all address fields'); return false;
    }
    if (!/^\d{10}$/.test(phone)) { toast.error('Enter a valid 10-digit phone number'); return false; }
    if (!/^\d{6}$/.test(pincode)) { toast.error('Enter a valid 6-digit pincode'); return false; }
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

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
        <p className="text-gray-600 mb-1">Thank you for your order.</p>
        <p className="text-sm text-gray-500 mb-6">Order ID: <span className="font-mono font-medium">{orderId}</span></p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/orders')} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-6 rounded-full text-sm">
            View Orders
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
              <h2 className="text-xl font-medium mb-4">Delivery Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'First and Last Name', col: 2 },
                  { name: 'phone', label: 'Mobile Number', placeholder: '10-digit mobile number', col: 1 },
                  { name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', col: 1 },
                  { name: 'house', label: 'Flat/House No./Building', placeholder: 'Flat, House no., Building', col: 2 },
                  { name: 'area', label: 'Area/Street/Locality', placeholder: 'Area, Street, Sector, Village', col: 2 },
                  { name: 'city', label: 'Town/City', placeholder: 'Town or City', col: 1 },
                ].map((f) => (
                  <div key={f.name} className={f.col === 2 ? 'md:col-span-2' : ''}>
                    <label className="text-sm font-medium block mb-1">{f.label}</label>
                    <input
                      type="text"
                      name={f.name}
                      value={address[f.name]}
                      onChange={handleAddressChange}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69]"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium block mb-1">State</label>
                  <select name="state" value={address.state} onChange={handleAddressChange}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69] bg-white">
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => { if (validateAddress()) setStep(1); }}
                className="mt-6 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm">
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order is delivered', icon: '💵' },
                  { id: 'UPI', label: 'UPI', desc: 'Pay using UPI apps like GPay, PhonePe, Paytm', icon: '📱' },
                  { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                  { id: 'NetBanking', label: 'Net Banking', desc: 'All major banks supported', icon: '🏦' },
                ].map((pm) => (
                  <label key={pm.id} className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${paymentMethod === pm.id ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)} className="accent-[#febd69]" />
                    <span className="text-2xl">{pm.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{pm.label}</p>
                      <p className="text-xs text-gray-500">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {(paymentMethod === 'UPI' || paymentMethod === 'Card' || paymentMethod === 'NetBanking') && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                  ℹ️ Payment gateway integration not included in this demo. Orders will be placed as pending.
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50">
                  ← Back
                </button>
                <button onClick={() => setStep(2)} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Review Your Order</h2>

              {/* Address summary */}
              <div className="bg-gray-50 rounded-md p-4 mb-4 text-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">Delivering to:</p>
                  <button onClick={() => setStep(0)} className="text-[#007185] hover:underline text-xs">Change</button>
                </div>
                <p className="font-medium">{address.name}</p>
                <p className="text-gray-600">{address.house}, {address.area}</p>
                <p className="text-gray-600">{address.city}, {address.state} — {address.pincode}</p>
                <p className="text-gray-600">Phone: {address.phone}</p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-md p-4 mb-4 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Payment:</p>
                    <p className="text-gray-600">{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-[#007185] hover:underline text-xs">Change</button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 border border-gray-100 rounded p-3">
                    <div className="w-16 h-16 bg-gray-50 flex-shrink-0 rounded">
                      <ProductImage src={item.img_link} alt={item.product_name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1">{item.product_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">₹{item.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full text-sm hover:bg-gray-50">
                  ← Back
                </button>
                <button onClick={placeOrder} disabled={placing}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm disabled:opacity-60">
                  {placing ? 'Placing Order...' : 'Place Your Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-[#c45500]">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items ({items.reduce((a, i) => a + i.quantity, 0)})</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={shippingPrice === 0 ? 'text-green-600' : ''}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-base text-red-700">
                <span>Order Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;