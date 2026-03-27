import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Plus, Trash2, MapPin } from 'lucide-react';

const Gardens = () => {
  const { t } = useTranslation();
  const [gardens, setGardens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', location: '', ownerName: '', ownerContact: '',
    leaseAmount: '', startDate: '', endDate: '', treeCount: '', variety: '', notes: ''
  });

  const fetchGardens = async () => {
    try {
      const res = await api.get('/gardens');
      setGardens(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGardens(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gardens', {
        ...formData,
        leaseAmount: parseFloat(formData.leaseAmount),
        treeCount: parseInt(formData.treeCount),
      });
      setShowModal(false);
      fetchGardens();
      setFormData({ name: '', location: '', ownerName: '', ownerContact: '', leaseAmount: '', startDate: '', endDate: '', treeCount: '', variety: '', notes: '' });
    } catch (err) { alert('Failed to create garden'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    try {
      await api.delete(`/gardens/${id}`);
      fetchGardens();
    } catch (err) { alert('Failed to delete garden'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('nav.gardens')}</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> <span className="hidden sm:inline">{t('common.add')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gardens.map(garden => (
          <div key={garden.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{garden.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin size={16} /> {garden.location}</p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Owner:</span> <span className="font-medium">{garden.ownerName}</span></div>
              <div className="flex justify-between"><span>Trees:</span> <span className="font-medium">{garden.treeCount}</span></div>
              <div className="flex justify-between"><span>Variety:</span> <span className="font-medium">{garden.variety}</span></div>
              <div className="flex justify-between"><span>Lease:</span> <span className="font-medium text-red-600">Rs. {garden.leaseAmount.toLocaleString()}</span></div>
            </div>
            <button onClick={() => handleDelete(garden.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">Add New Garden</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Garden Name" className="border p-3 rounded-lg w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Location" className="border p-3 rounded-lg w-full" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <input required placeholder="Owner Name" className="border p-3 rounded-lg w-full" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
              <input required placeholder="Owner Contact" className="border p-3 rounded-lg w-full" value={formData.ownerContact} onChange={e => setFormData({...formData, ownerContact: e.target.value})} />
              <input required type="number" placeholder="Lease Amount (Rs.)" className="border p-3 rounded-lg w-full" value={formData.leaseAmount} onChange={e => setFormData({...formData, leaseAmount: e.target.value})} />
              <input required type="number" placeholder="Tree Count" className="border p-3 rounded-lg w-full" value={formData.treeCount} onChange={e => setFormData({...formData, treeCount: e.target.value})} />
              <input required placeholder="Mango Variety" className="border p-3 rounded-lg w-full" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} />
              <input type="text" placeholder="Notes" className="border p-3 rounded-lg w-full" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Start Date</label>
                <input required type="date" className="border p-3 rounded-lg w-full" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">End Date</label>
                <input required type="date" className="border p-3 rounded-lg w-full" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
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

export default Gardens;
