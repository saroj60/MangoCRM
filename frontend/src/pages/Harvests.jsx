import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Plus, Trash2, Leaf } from 'lucide-react';

const Harvests = () => {
  const { t } = useTranslation();
  const [harvests, setHarvests] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ gardenId: '', date: '', quantity: '', laborCost: '', notes: '' });

  const fetchData = async () => {
    try {
      const [resHar, resGar] = await Promise.all([
        api.get('/harvests'), api.get('/gardens')
      ]);
      setHarvests(resHar.data);
      setGardens(resGar.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/harvests', {
        ...formData,
        quantity: parseFloat(formData.quantity),
        laborCost: parseFloat(formData.laborCost),
      });
      setShowModal(false);
      fetchData();
      setFormData({ gardenId: '', date: '', quantity: '', laborCost: '', notes: '' });
    } catch (err) { alert('Failed to record harvest'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    try {
      await api.delete(`/harvests/${id}`);
      fetchData();
    } catch (err) { alert('Failed to delete harvest record'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('nav.harvests')}</h2>
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
                <th className="p-4 font-medium">Garden</th>
                <th className="p-4 font-medium">Quantity (Kg/Tons)</th>
                <th className="p-4 font-medium">Labor Cost</th>
                <th className="p-4 font-medium">Notes</th>
                <th className="p-4 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {harvests.map(harvest => (
                <tr key={harvest.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">{new Date(harvest.date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-primary flex items-center gap-2"><Leaf size={16}/> {harvest.garden?.name}</td>
                  <td className="p-4 font-semibold">{harvest.quantity} <span className="text-gray-500 font-normal">units</span></td>
                  <td className="p-4 text-red-600">Rs. {harvest.laborCost.toLocaleString()}</td>
                  <td className="p-4 text-gray-500 truncate max-w-[150px]">{harvest.notes || '-'}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(harvest.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {harvests.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No harvests recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-6">Log New Harvest</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select required className="border p-3 rounded-lg w-full bg-white" value={formData.gardenId} onChange={e => setFormData({...formData, gardenId: e.target.value})}>
                <option value="">Select Garden...</option>
                {gardens.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" step="0.01" placeholder="Quantity Extracted" className="border p-3 rounded-lg w-full" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                <input required type="number" placeholder="Labor Cost (Rs.)" className="border p-3 rounded-lg w-full" value={formData.laborCost} onChange={e => setFormData({...formData, laborCost: e.target.value})} />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Harvest Date</label>
                <input required type="date" className="border p-3 rounded-lg w-full text-gray-700" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <input type="text" placeholder="Notes" className="border p-3 rounded-lg w-full" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              
              <div className="flex justify-end gap-3 mt-4">
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

export default Harvests;
