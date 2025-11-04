// Servicio de autenticación
const AUTH_API_URL = "https://pet-manager-auth-service.onrender.com";

export interface AuthRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// Servicio de autenticación
export const authService = {
  // Login
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al iniciar sesión: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error: any) {
      console.error("Error logging in:", error);
      
      // Mejorar mensaje de error para CORS
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Error de conexión: No se pudo conectar con el servidor. Verifica que el servidor esté disponible y que CORS esté configurado correctamente."
        );
      }
      
      throw error;
    }
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Error al refrescar el token");
      }

      return await response.json();
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },

  // Obtener clave pública
  getPublicKey: async (): Promise<string> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/api/auth/public-key`);
      if (!response.ok) {
        throw new Error("Error al obtener la clave pública");
      }
      const data = await response.json();
      return data.publicKey;
    } catch (error) {
      console.error("Error getting public key:", error);
      throw error;
    }
  },
};

// Utilidades para manejar tokens
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};

