import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as usersApi from "../api/auth";
import { Outlet, useNavigate } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  register: (params: { username: string; password: string }) => Promise<void>;
  login: (params: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    usersApi
      .authStatus()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoadingInitial(false));
  }, []);

  useEffect(() => {
    if (loadingInitial) return;

    if (isLoggedIn) {
      navigate("/library");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, loadingInitial, navigate]);

  const register = (params: { username: string; password: string }) => {
    return usersApi.register(params).then(() => setIsLoggedIn(true));
  };

  const login = (params: { username: string; password: string }) => {
    return usersApi.login(params).then(() => setIsLoggedIn(true));
  };

  const logout = () => {
    usersApi.logout().then(() => setIsLoggedIn(false));
  };

  const memoedValue = useMemo(
    () => ({
      isLoggedIn,
      register,
      login,
      logout,
    }),
    [isLoggedIn]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && <Outlet />}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
