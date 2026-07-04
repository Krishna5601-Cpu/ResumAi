import { Children, createContext, useState } from "react";

export AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const [user, setUser] = useState(null);
  const [loading, SetLoading] = useState(false);

  return (
    <AuthContext.Provider value={{user, setUser, loading, setUser}} > { children} </AuthContext.Provider>
  )
}
