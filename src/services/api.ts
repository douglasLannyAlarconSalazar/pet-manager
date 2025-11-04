// Configuración base de las APIs
const API_BASE_URLS = {
  clientes: "https://pet-manager-back.onrender.com",
  reportes: "https://pet-manager-back-reporte.onrender.com",
  notificaciones: "https://pet-manager-back-fmwv.onrender.com",
};

// Función helper para obtener headers con autenticación
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Tipos para Cliente (basado en ClienteDTO del backend)
export interface Cliente {
  idCliente?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string; // LocalDate en formato ISO
  estado: boolean;
  puntosFidelidad?: number;
}

// Tipo para Cliente Frecuente (basado en ReporteClientesFrecuentesDTO del backend)
export interface ClienteFrecuente {
  nombre: string;
  email: string;
  puntosFidelidad?: number;
  preferencias: string[];
  numeroCompras: number;
  totalGastado: number;
  productosFavoritos: string[];
}

// Servicio de Clientes (CRUD)
export const clienteService = {
  // Obtener todos los clientes
  getAll: async (): Promise<Cliente[]> => {
    try {
      const response = await fetch(`${API_BASE_URLS.clientes}/api/clientes`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        throw new Error(`Error al obtener clientes: ${response.statusText}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.content || [];
    } catch (error) {
      console.error("Error fetching clientes:", error);
      throw error;
    }
  },

  // Obtener un cliente por ID
  getById: async (id: number): Promise<Cliente> => {
    try {
      const response = await fetch(`${API_BASE_URLS.clientes}/api/clientes/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Cliente no encontrado");
        }
        throw new Error(`Error al obtener cliente: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching cliente:", error);
      throw error;
    }
  },

  // Crear un nuevo cliente
  create: async (cliente: Omit<Cliente, "idCliente" | "fechaRegistro">): Promise<Cliente> => {
    try {
      const response = await fetch(`${API_BASE_URLS.clientes}/api/clientes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        if (response.status === 409) {
          throw new Error("Ya existe un cliente con ese email");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al crear cliente: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating cliente:", error);
      throw error;
    }
  },

  // Actualizar un cliente
  update: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    try {
      const response = await fetch(`${API_BASE_URLS.clientes}/api/clientes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        if (response.status === 404) {
          throw new Error("Cliente no encontrado");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al actualizar cliente: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating cliente:", error);
      throw error;
    }
  },

  // Eliminar un cliente
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URLS.clientes}/api/clientes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        if (response.status === 404) {
          throw new Error("Cliente no encontrado");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al eliminar cliente: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error deleting cliente:", error);
      throw error;
    }
  },
};

// Servicio de Reportes
export const reporteService = {
  // Obtener reporte de clientes frecuentes
  getClientesFrecuentes: async (): Promise<ClienteFrecuente[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URLS.reportes}/api/reportes/clientes-frecuentes`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        throw new Error(`Error al obtener reporte: ${response.statusText}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : data.content || [];
    } catch (error) {
      console.error("Error fetching clientes frecuentes:", error);
      throw error;
    }
  },
};

// Tipos para Notificaciones
export interface EmailRequest {
  idCliente: number;
  idPromocion: number;
  idUsuario: number;
  mensajePersonalizado?: string;
}

export interface SmsRequest {
  idCliente: number;
  idPromocion: number;
  idUsuario: number;
  mensajePersonalizado?: string;
}

export interface EmailMasivoRequest {
  idClientes: number[];
  idPromocion: number;
  idUsuario: number;
  mensajePersonalizado?: string;
}

export interface PromocionPersonalizadaRequest {
  idCliente: number;
  idPromocion: number;
  idUsuario: number;
  canalEnvio: string; // EMAIL, SMS, WHATSAPP, PUSH
  mensajePersonalizado?: string;
}

export interface NotificacionResponse {
  idNotificacion?: number;
  id: number; // Para compatibilidad
  idCliente: number;
  idPromocion: number;
  canalEnvio?: string;
  canal?: string; // Para compatibilidad
  estadoEntrega?: string;
  estado?: string; // Para compatibilidad
  fechaEnvio?: string;
  mensaje?: string;
  nombrePromocion?: string;
  descripcionPromocion?: string;
  tipoDescuento?: string;
  valorDescuento?: string;
}

export interface Promocion {
  idPromocion: number;
  nombre: string;
  descripcion?: string;
  tipoDescuento?: string;
  valorDescuento?: string;
  fechaInicio?: string;
  fechaFin?: string;
  categoriaAplicable?: string;
  estado?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// Servicio de Notificaciones
export const notificacionService = {
  // Enviar email
  enviarEmail: async (request: EmailRequest): Promise<ApiResponse<NotificacionResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URLS.notificaciones}/api/notificaciones/email`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al enviar email: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  // Enviar SMS
  enviarSms: async (request: SmsRequest): Promise<ApiResponse<NotificacionResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URLS.notificaciones}/api/notificaciones/sms`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al enviar SMS: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  },

  // Enviar email masivo
  enviarEmailMasivo: async (request: EmailMasivoRequest): Promise<ApiResponse<string>> => {
    try {
      const response = await fetch(
        `${API_BASE_URLS.notificaciones}/api/notificaciones/email-masivo`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al enviar emails masivos: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending mass emails:", error);
      throw error;
    }
  },

  // Enviar promoción personalizada
  enviarPromocionPersonalizada: async (
    request: PromocionPersonalizadaRequest
  ): Promise<ApiResponse<NotificacionResponse>> => {
    try {
      const response = await fetch(
        `${API_BASE_URLS.notificaciones}/api/notificaciones/personalizada`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al enviar promoción personalizada: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error sending personalized promotion:", error);
      throw error;
    }
  },

  // Obtener todas las notificaciones
  obtenerTodasLasNotificaciones: async (): Promise<ApiResponse<NotificacionResponse[]>> => {
    try {
      const response = await fetch(
        `${API_BASE_URLS.notificaciones}/api/notificaciones`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al obtener notificaciones: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching notificaciones:", error);
      throw error;
    }
  },

  // Obtener promociones desde el CRUD de promociones (separado de notificaciones)
  obtenerPromociones: async (): Promise<Promocion[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URLS.notificaciones}/api/promociones`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al obtener promociones: ${response.statusText}`
        );
      }
      const apiResp = await response.json();
      const list = (apiResp?.data ?? []) as Array<any>;
      return list.map((p) => ({
        idPromocion: p.idPromocion,
        nombre: p.nombre,
        descripcion: p.descripcion,
        tipoDescuento: p.tipoDescuento,
        valorDescuento: typeof p.valorDescuento === "number" ? String(p.valorDescuento) : p.valorDescuento,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin,
        categoriaAplicable: p.categoriaAplicable,
        estado: p.estado,
      }));
    } catch (error) {
      console.error("Error fetching promociones:", error);
      return [];
    }
  },
};

