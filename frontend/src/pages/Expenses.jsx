import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';

const Expenses = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [gardens, setGardens] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ gardenId: '', type: '', supplierId: '', cost: '', date: '', notes: '' });

  const fetchData = async () => {
    try {
      const [resExp, resGar, resSup] = await Promise.all([
        api.get('/expenses'), api.get('/gardens'), api.get('/suppliers')
      ]);
      setExpenses(resExp.data);
      setGardens(resGar.data);
      setSuppliers(resSup.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', {
        ...formData,
        cost: parseFloat(formData.cost),
        supplierId: formData.supplierId || null,
      });
      setShowModal(false);
      fetchData();
      setFormData({ gardenId: '', type: '', supplierId: '', cost: '', date: '', notes: '' });
    } catch (err) { alert('Failed to add expense'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchData();
    } catch (err) { alert('Failed to delete expense'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('nav.expenses')}</h2>
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
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Supplier</th>
                <th className="p-4 font-medium">Cost</th>
                <th className="p-4 font-medium">Notes</th>
                <th className="p-4 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{expense.garden?.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{expense.type}</span>
                  </td>
                  <td className="p-4 text-gray-500">{expense.supplier?.name || '-'}</td>
                  <td className="p-4 font-semibold text-red-600">Rs. {expense.cost.toLocaleString()}</td>
                  <td className="p-4 text-gray-500 truncate max-w-[150px]">{expense.notes || '-'}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No expenses recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-6">Log New Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select required className="border p-3 rounded-lg w-full bg-white" value={formData.gardenId} onChange={e => setFormData({...formData, gardenId: e.target.value})}>
                <option value="">Select Garden...</option>
                {gardens.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              
              <input required placeholder="Expense Type (e.g. Pesticide, Labor)" className="border p-3 rounded-lg w-full" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
              
              <select className="border p-3 rounded-lg w-full bg-white text-gray-700" value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                <option value="">Select Supplier (Optional)...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} - {s.type}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Cost (Rs.)" className="border p-3 rounded-lg w-full" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
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

export default Expenses;
