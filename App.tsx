
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import QuoteGenerator from './components/QuoteGenerator';
import AdminPanel from './components/AdminPanel';
import { UsersProvider } from './hooks/useUsers';
import { LogOut, Users, FileText } from 'lucide-react';

type View = 'quotes' | 'admin';

const App: React.FC = () => {
  return (
    <UsersProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </UsersProvider>
  );
};

const Main: React.FC = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState<View>('quotes');

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-yellow-400">QuoteGen Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block">Bienvenido, {user.name} ({user.role})</span>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="Cerrar Sesión"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {user.role === 'admin' && (
          <nav className="bg-gray-800 w-16 md:w-56 p-2 md:p-4 flex flex-col">
            <button
              onClick={() => setView('quotes')}
              className={`flex items-center p-2 md:px-4 rounded-md text-sm font-medium ${
                view === 'quotes' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FileText className="h-5 w-5 mr-0 md:mr-3" />
              <span className="hidden md:inline">Presupuestos</span>
            </button>
            <button
              onClick={() => setView('admin')}
              className={`mt-2 flex items-center p-2 md:px-4 rounded-md text-sm font-medium ${
                view === 'admin' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Users className="h-5 w-5 mr-0 md:mr-3" />
              <span className="hidden md:inline">Panel de Admin</span>
            </button>
          </nav>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {view === 'quotes' && <QuoteGenerator />}
          {view === 'admin' && user.role === 'admin' && <AdminPanel />}
        </main>
      </div>
    </div>
  );
};

export default App;