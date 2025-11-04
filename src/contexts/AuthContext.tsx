import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, tokenStorage, AuthRequest, AuthResponse } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la app
    const token = tokenStorage.getAccessToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (credentials: AuthRequest) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authService.login(credentials);
      
      // Guardar tokens
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      setIsAuthenticated(true);
      toast({
        title: "Éxito",
        description: "Sesión iniciada correctamente",
      });
      
      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.clearTokens();
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/");
  };

  const getAccessToken = () => {
    return tokenStorage.getAccessToken();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

