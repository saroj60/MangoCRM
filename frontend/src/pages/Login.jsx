import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mango CRM</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50/50"
                placeholder="Login ID (Phone / Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm bg-gray-50/50"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent font-semibold rounded-xl text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md hover:shadow-lg cursor-pointer text-lg"
            >
              {t('common.login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
