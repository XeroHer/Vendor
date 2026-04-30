import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
const API_URL = import.meta.env.VITE_API_URL;
interface AuthContextType {
  user: any;
  loading: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(() => {
    const cached = localStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  // 🔐 LOGIN
  const login = (userData: any, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🚪 LOGOUT (FIXED)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);

    // 🔥 force UI sync across components
    window.dispatchEvent(new Event("storage"));
  };

  // 🔄 REFRESH USER
  const refreshUser = async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unauthorized");
      }

      const normalizedUser = data.user || data;

      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } catch (err) {
      // 🔥 IMPORTANT: cleanup everything on failure
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 INIT AUTH ON LOAD
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 CUSTOM HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};