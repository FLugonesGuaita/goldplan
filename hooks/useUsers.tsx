import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    password: 'password',
    role: 'admin',
    title: 'General Manager',
    address: '123 Main St, Anytown',
    phone: '555-123-4567'
  },
  {
    id: '2',
    name: 'Federico Lugones',
    username: 'federico',
    password: 'password',
    role: 'seller',
    title: 'Asesor Comercial',
    address: 'Angel Gallardo 155 - CABA',
    phone: '11-5571-4614'
  }
];

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (error) {
      console.error('Error parsing users from localStorage', error);
    }
    localStorage.setItem('users', JSON.stringify(initialUsers));
    return initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: new Date().toISOString() };
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  return (
    <UsersContext.Provider value={{ users, addUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
