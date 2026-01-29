// 'use client';

// import axios from 'axios';
// import { createContext, useState, ReactNode, useEffect } from 'react';
// import { ResponseType } from '../lib/userDataType/userType';

// export type User = {
//   name: string;
//   email: string;
//   profileImg: string;
//   token: string;
//   isLoggedIn: boolean;
//   authLoading: boolean;
// }

// type UserContextType = {
//   user: User;
//   handleLogin: (data: User) => void;
//   handleLogout: () => void;
// };

// const initialData = { name: "", email: '', profileImg: '', token: '', isLoggedIn: false, authLoading: false };
// const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_URL;

// export const UserContext = createContext<UserContextType>({
//   user: initialData,
//   handleLogin: () => { },
//   handleLogout: () => { },
// });

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>(initialData);

//   return (
//     <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }