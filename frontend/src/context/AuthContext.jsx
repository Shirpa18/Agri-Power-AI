import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "agripower_auth";

const DEFAULT_USER = {
  name: "Farm Administrator",
  farm: "Green Valley Farm",
  role: "Farm Administrator",
  email: "admin@agripower.ai",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(
        AUTH_STORAGE_KEY
      );

      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);

        if (parsedAuth?.authenticated) {
          setUser(
            parsedAuth.user || DEFAULT_USER
          );
        }
      }
    } catch (error) {
      localStorage.removeItem(
        AUTH_STORAGE_KEY
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (
      normalizedEmail !== "admin@agripower.ai" ||
      password !== "agripower"
    ) {
      throw new Error(
        "Invalid email or password."
      );
    }

    const authenticatedUser = {
      ...DEFAULT_USER,
      email: normalizedEmail,
    };

    setUser(authenticatedUser);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        authenticated: true,
        user: authenticatedUser,
      })
    );

    return authenticatedUser;
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      AUTH_STORAGE_KEY
    );
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}