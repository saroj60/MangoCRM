import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '../api/axios';
import { Map, Receipt, TrendingUp, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load stats.</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{t('nav.dashboard')}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('dashboard.total_gardens')}
          value={stats.totalGardens}
          icon={Map}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title={t('dashboard.total_expenses')}
          value={`Rs. ${stats.totalExpenses.toLocaleString()}`}
          icon={Receipt}
          colorClass="bg-red-50 text-red-600"
        />
        <StatCard
          title={t('dashboard.total_revenue')}
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          colorClass="bg-green-50 text-green-600"
        />
        <StatCard
          title={t('dashboard.net_profit')}
          value={`Rs. ${stats.netProfit.toLocaleString()}`}
          icon={DollarSign}
          colorClass="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{t('dashboard.profit_by_garden')}</h3>
        <div className="h-[400px] w-full">
          {stats.profitByGarden.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">No data available yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.profitByGarden} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(val) => `Rs.${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => `Rs. ${value.toLocaleString()}`}
                />
                <Legend iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="profit" name="Profit" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
