import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductImage from './ProductImage';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#febd69]" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mx-auto text-gray-300 mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
      <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
      <p className="text-gray-500 mb-6 text-sm">When you place an order, it will appear here.</p>
      <Link to="/" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-8 rounded-full text-sm">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-medium mb-6">Your Orders</h1>
      <p className="text-sm text-gray-500 mb-4">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const currentStep = STATUS_STEPS.indexOf(order.status);

          return (
            <div key={order._id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
              {/* Order header */}
              <div className="bg-gray-50 p-4 flex flex-wrap gap-4 justify-between items-start border-b border-gray-200">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-medium">Order Placed</p>
                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-medium">Total</p>
                    <p className="font-medium">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-xs font-medium">Ship to</p>
                    <p className="font-medium">{order.shippingAddress?.name}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>Order # <span className="font-mono">{order._id.slice(-8).toUpperCase()}</span></p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {order.status !== 'Cancelled' && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    {STATUS_STEPS.map((s, i) => (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-[#febd69] text-black' : 'bg-gray-200 text-gray-400'}`}>
                            {i < currentStep ? '✓' : i + 1}
                          </div>
                          <p className="text-xs mt-1 text-gray-500 hidden sm:block">{s}</p>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? 'bg-[#febd69]' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Items preview */}
              <div className="p-4">
                <div className="flex gap-3 flex-wrap">
                  {order.orderItems.slice(0, isExpanded ? undefined : 2).map((item, idx) => (
                    <div key={idx} className="flex gap-3 w-full sm:w-auto flex-1 min-w-0">
                      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded flex-shrink-0">
                        <ProductImage src={item.img_link} alt={item.product_name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm line-clamp-2">{item.product_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.numericPrice?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                  {!isExpanded && order.orderItems.length > 2 && (
                    <button onClick={() => setExpandedOrder(order._id)} className="text-sm text-[#007185] hover:underline self-center">
                      +{order.orderItems.length - 2} more
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1">Delivery Address</p>
                        <p className="text-gray-600 text-xs">{order.shippingAddress?.house}, {order.shippingAddress?.area}</p>
                        <p className="text-gray-600 text-xs">{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
                        <p className="text-gray-600 text-xs">Phone: {order.shippingAddress?.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Payment</p>
                        <p className="text-gray-600 text-xs">{order.paymentMethod}</p>
                        <p className={`text-xs font-medium mt-1 ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString('en-IN')}` : 'Payment Pending'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
                      <div className="flex justify-between"><span>Items</span><span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Delivery</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                      <div className="flex justify-between font-bold text-sm text-gray-800 pt-1 border-t border-gray-100">
                        <span>Order Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-3 flex-wrap">
                  <button onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                    {isExpanded ? 'Show less' : 'View details'}
                  </button>

                  {['Pending', 'Processing'].includes(order.status) && (
                    <button onClick={() => handleCancel(order._id)}
                      className="text-sm text-red-600 hover:underline">
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'Delivered' && (
                    <button className="text-sm text-[#007185] hover:underline">
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersPage;