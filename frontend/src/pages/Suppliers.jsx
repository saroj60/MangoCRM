import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Plus, Trash2, Phone } from 'lucide-react';

const Suppliers = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', type: '' });

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', formData);
      setShowModal(false);
      fetchSuppliers();
      setFormData({ name: '', contact: '', type: '' });
    } catch (err) { alert('Failed to create supplier'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) { alert('Failed to delete supplier'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('nav.suppliers')}</h2>
        <button onClick={() => setShowModal(true)} className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> <span className="hidden sm:inline">{t('common.add')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{supplier.name}</h3>
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium mb-4">{supplier.type}</span>
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <span>{supplier.contact}</span>
            </div>
            <button onClick={() => handleDelete(supplier.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">Add New Supplier</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Supplier Name" className="border p-3 rounded-lg w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Contact Number" className="border p-3 rounded-lg w-full" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              <input required placeholder="Type (e.g., Fertilizer, Transport)" className="border p-3 rounded-lg w-full" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
              
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

export default Suppliers;
