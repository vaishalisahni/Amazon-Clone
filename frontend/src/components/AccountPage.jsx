import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

function AccountPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', phone: '', house: '', area: '', city: '', state: 'Delhi', pincode: '', isDefault: false });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile({ name: data.name, email: data.email, phone: data.phone || '' });
        setAddresses(data.addresses || []);
      } catch (err) {
        toast.error('Could not load profile');
      } finally {
        setDataLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', profile);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    if (passwords.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.put('/users/profile', { password: passwords.newPass });
      toast.success('Password updated!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error('Could not update password');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/address', newAddress);
      setAddresses(data);
      setShowAddForm(false);
      setNewAddress({ name: '', phone: '', house: '', area: '', city: '', state: 'Delhi', pincode: '', isDefault: false });
      toast.success('Address added!');
    } catch (err) {
      toast.error('Could not save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const { data } = await api.delete(`/users/address/${addressId}`);
      setAddresses(data.addresses);
      toast.success('Address removed');
    } catch {
      toast.error('Could not remove address');
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  if (dataLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#febd69]" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-medium mb-6">Your Account</h1>

      {/* Quick actions grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Your Orders', icon: '📦', to: '/orders', desc: 'Track, return or buy again' },
          { label: 'Your Wishlist', icon: '❤️', to: '/wishlist', desc: 'Your saved items' },
          { label: 'Your Cart', icon: '🛒', to: '/cart', desc: 'View your cart' },
          { label: 'Help', icon: '❓', to: '/', desc: 'Get help & contact us' },
        ].map((a) => (
          <Link key={a.label} to={a.to} className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
            <p className="text-2xl mb-1">{a.icon}</p>
            <p className="font-medium text-sm">{a.label}</p>
            <p className="text-xs text-gray-500">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-48 flex-shrink-0">
          <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${tab === t.id ? 'bg-[#febd69]/20 text-[#c45500] border-r-2 border-[#febd69]' : 'hover:bg-gray-50 text-gray-700'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-md border border-gray-200 p-6">

          {/* Profile tab */}
          {tab === 'profile' && (
            <div>
              <h2 className="text-xl font-medium mb-4">Personal Information</h2>
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                {[
                  { label: 'Full Name', key: 'name', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Mobile Number', key: 'phone', type: 'tel', placeholder: '10-digit mobile number' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-medium block mb-1">{f.label}</label>
                    <input type={f.type} value={profile[f.key]}
                      onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69]" />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-6 rounded-full text-sm disabled:opacity-60">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Addresses tab */}
          {tab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Saved Addresses</h2>
                <button onClick={() => setShowAddForm(!showAddForm)}
                  className="text-sm bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-1.5 px-4 rounded-full">
                  + Add Address
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-200">
                  <h3 className="font-medium mb-3 text-sm">New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'name', label: 'Full Name', col: 1 },
                      { name: 'phone', label: 'Phone', col: 1 },
                      { name: 'house', label: 'House/Flat/Building', col: 2 },
                      { name: 'area', label: 'Area/Street', col: 2 },
                      { name: 'city', label: 'City', col: 1 },
                      { name: 'pincode', label: 'Pincode', col: 1 },
                    ].map((f) => (
                      <div key={f.name} className={f.col === 2 ? 'md:col-span-2' : ''}>
                        <label className="text-xs font-medium block mb-1">{f.label}</label>
                        <input type="text" name={f.name} value={newAddress[f.name]}
                          onChange={(e) => setNewAddress({ ...newAddress, [e.target.name]: e.target.value })}
                          required
                          className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69]" />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs font-medium block mb-1">State</label>
                      <select value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#febd69]">
                        {STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <input type="checkbox" id="isDefault" checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="accent-[#febd69]" />
                      <label htmlFor="isDefault" className="text-sm">Set as default</label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button type="submit" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-1.5 px-5 rounded-full text-sm">Save</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="border border-gray-300 text-gray-700 font-medium py-1.5 px-5 rounded-full text-sm hover:bg-gray-50">Cancel</button>
                  </div>
                </form>
              )}

              {addresses.length === 0 && !showAddForm && (
                <p className="text-sm text-gray-500">No saved addresses yet.</p>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr._id} className={`border rounded-md p-4 text-sm relative ${addr.isDefault ? 'border-[#febd69] bg-orange-50' : 'border-gray-200'}`}>
                    {addr.isDefault && <span className="absolute top-2 right-2 text-xs bg-[#febd69] text-black px-2 py-0.5 rounded-full font-medium">Default</span>}
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-gray-600">{addr.house}, {addr.area}</p>
                    <p className="text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-gray-600">Phone: {addr.phone}</p>
                    <div className="flex gap-3 mt-2">
                      <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500 hover:underline text-xs">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security tab */}
          {tab === 'security' && (
            <div>
              <h2 className="text-xl font-medium mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                {[
                  { label: 'New Password', key: 'newPass', placeholder: 'At least 6 characters' },
                  { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-medium block mb-1">{f.label}</label>
                    <input type="password" value={passwords[f.key]}
                      onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      required
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#febd69]" />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-black font-medium py-2 px-6 rounded-full text-sm disabled:opacity-60">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;