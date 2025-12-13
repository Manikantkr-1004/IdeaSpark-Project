'use client';

import axios from 'axios';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { ResponseType } from '../lib/userDataType/userType';

export type User = {
  name: string;
  email: string;
  profileImg: string;
  token: string;
  isLoggedIn: boolean;
  authLoading: boolean;
}

type UserContextType = {
  user: User;
  handleLogin: (data: User) => void;
  handleLogout: () => void;
};

const initialData = { name: "", email: '', profileImg: '', token: '', isLoggedIn: false, authLoading: false };
const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

export const UserContext = createContext<UserContextType>({
  user: initialData,
  handleLogin: () => { },
  handleLogout: () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialData);

  useEffect(() => {
    fetchUserAuth();
  }, []);

  const handleLogin = (data: User) => {
    setUser(data);
    localStorage.setItem('ideaspark-token', data?.token);
  }

  const handleLogout = () => {
    setUser(initialData);
    localStorage.removeItem('ideaspark-token');
  }

  const fetchUserAuth = async () => {
    try {
      setUser((prev)=> ({...prev, authLoading: true}));
      const token = localStorage.getItem('ideaspark-token');
      const response = await axios.get(`${BACKEND_API}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data: ResponseType = response.data;
      handleLogin({ ...data?.data, isLoggedIn: true, token })

    } catch (error: any) {
      console.log('Error in checking user auth', error);
      handleLogout();
      setUser((prev)=> ({...prev, authLoading: false}));
    }
  }

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
}