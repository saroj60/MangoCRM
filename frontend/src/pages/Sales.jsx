import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

const Sales = () => {
  const { t } = useTranslation();
  const [sales, setSales] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ buyerName: '', location: '', gardenId: '', quantity: '', pricePerUnit: '', transportCost: '', date: '' });

  const fetchData = async () => {
    try {
      const [resSal, resGar] = await Promise.all([
        api.get('/sales'), api.get('/gardens')
      ]);
      setSales(resSal.data);
      setGardens(resGar.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sales', {
        ...formData,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        transportCost: parseFloat(formData.transportCost),
      });
      setShowModal(false);
      fetchData();
      setFormData({ buyerName: '', location: '', gardenId: '', quantity: '', pricePerUnit: '', transportCost: '', date: '' });
    } catch (err) { alert('Failed to log sale'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    try {
      await api.delete(`/sales/${id}`);
      fetchData();
    } catch (err) { alert('Failed to delete sale'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('nav.sales')}</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> <span className="hidden sm:inline">{t('common.add')}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Buyer</th>
                <th className="p-4 font-medium">Garden Source</th>
                <th className="p-4 font-medium text-right">Qty</th>
                <th className="p-4 font-medium text-right">Price/Unit</th>
                <th className="p-4 font-medium text-right">Transport</th>
                <th className="p-4 font-medium text-right">Total Revenue</th>
                <th className="p-4 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {sales.map(sale => {
                const total = (sale.quantity * sale.pricePerUnit) - sale.transportCost;
                return (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{sale.buyerName}</p>
                      <p className="text-xs text-gray-500">{sale.location}</p>
                    </td>
                    <td className="p-4">{sale.garden?.name}</td>
                    <td className="p-4 text-right">{sale.quantity}</td>
                    <td className="p-4 text-right">Rs. {sale.pricePerUnit}</td>
                    <td className="p-4 text-right text-red-500">Rs. {sale.transportCost}</td>
                    <td className="p-4 text-right font-bold text-green-600">Rs. {total.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(sale.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr><td colSpan="8" className="p-8 text-center text-gray-500">No sales recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-6">Log New Sale</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Buyer Name" className="border p-3 rounded-lg w-full" value={formData.buyerName} onChange={e => setFormData({...formData, buyerName: e.target.value})} />
              <input required placeholder="Location" className="border p-3 rounded-lg w-full" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              
              <select required className="border p-3 rounded-lg w-full bg-white col-span-1 sm:col-span-2" value={formData.gardenId} onChange={e => setFormData({...formData, gardenId: e.target.value})}>
                <option value="">Select Target Garden...</option>
                {gardens.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>

              <input required type="number" step="0.01" placeholder="Quantity Sold" className="border p-3 rounded-lg w-full" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              <input required type="number" step="0.01" placeholder="Price Per Unit (Rs.)" className="border p-3 rounded-lg w-full" value={formData.pricePerUnit} onChange={e => setFormData({...formData, pricePerUnit: e.target.value})} />
              
              <input required type="number" placeholder="Transport Cost (Rs.)" className="border p-3 rounded-lg w-full" value={formData.transportCost} onChange={e => setFormData({...formData, transportCost: e.target.value})} />
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Sale Date</label>
                <input required type="date" className="border p-3 rounded-lg w-full text-gray-700" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">{t('common.cancel')}</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
