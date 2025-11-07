
import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User, Role } from '../types';
import { PlusCircle, UserPlus, X } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { users, addUser } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    username: '',
    password: '',
    role: 'seller',
    title: '',
    address: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password) {
      addUser(newUser);
      setNewUser({
        name: '',
        username: '',
        password: '',
        role: 'seller',
        title: '',
        address: '',
        phone: '',
      });
      setShowForm(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">Gestión de Usuarios</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-bold py-2 px-4 rounded-lg flex items-center transition duration-300"
        >
          {showForm ? <X className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
          {showForm ? 'Cancelar' : 'Añadir Usuario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-gray-700 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="bg-gray-800 p-2 rounded text-white placeholder-gray-400" type="text" name="name" placeholder="Nombre Completo" value={newUser.name} onChange={handleInputChange} required />
          <input className="bg-gray-800 p-2 rounded text-white placeholder-gray-400" type="text" name="username" placeholder="Nombre de Usuario" value={newUser.username} onChange={handleInputChange} required />
          <input className="bg-gray-800 p-2 rounded text-white placeholder-gray-400" type="password" name="password" placeholder="Contraseña" value={newUser.password} onChange={handleInputChange} required />
          <select className="bg-gray-800 p-2 rounded text-white" name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="seller">Vendedor</option>
            <option value="admin">Admin</option>
          </select>
          <input className="bg-gray-800 p-2 rounded text-white placeholder-gray-400" type="text" name="title" placeholder="Cargo" value={newUser.title} onChange={handleInputChange} required />
          <input className="bg-gray-800 p-2 rounded text-white placeholder-gray-400" type="text" name="address" placeholder="Dirección" value={newUser.address} onChange={handleInputChange} required />
          <input className="bg-gray-800 p-2 rounded text-white placeholder-gray-400" type="text" name="phone" placeholder="Número de Teléfono" value={newUser.phone} onChange={handleInputChange} required />
          <button type="submit" className="md:col-span-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition duration-300">
            <PlusCircle className="h-5 w-5 mr-2" /> Crear Usuario
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-700 text-yellow-400">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Nombre de Usuario</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Cargo</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">{user.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;