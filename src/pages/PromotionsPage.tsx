import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar } from "@/components/Sidebar";
import { Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notificacionService, EmailMasivoRequest, Promocion } from "@/services/api";
import { clienteService, Cliente } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const PromotionsPage = () => {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("all");
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [selectedPromocionId, setSelectedPromocionId] = useState<string>("");
  const [promocionFilter, setPromocionFilter] = useState<string>("");
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingPromociones, setLoadingPromociones] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const { toast } = useToast();
  const auth = useAuth();

  function base64UrlDecode(input: string): string {
    const pad = (input.length % 4 === 2) ? '==' : (input.length % 4 === 3) ? '=' : '';
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
    try {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return atob(base64);
    }
  }

  function tryParseNumericId(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const n = parseInt(value, 10);
      if (!Number.isNaN(n) && Number.isFinite(n)) return n;
    }
    return null;
  }

  // Cargar clientes y promociones al montar el componente
  useEffect(() => {
    const loadData = async () => {
      // Decodificar ID de usuario desde el token
      try {
        const token = auth.getAccessToken?.() || localStorage.getItem("accessToken");
        if (token) {
          const parts = token.split(".");
          if (parts.length === 3) {
            const decoded = base64UrlDecode(parts[1]);
            const payload = JSON.parse(decoded);
            const candidateRaw =
              payload.userId ?? payload.usuarioId ?? payload.id ?? payload.user_id ?? payload.usuario_id ?? payload.uid ?? payload.sub;
            const parsed = tryParseNumericId(candidateRaw);
            if (parsed !== null) setIdUsuario(parsed);
          }
        }
      } catch {
        // Si falla el decode, dejamos idUsuario como null
      }
      // Cargar clientes
      try {
        setLoadingClientes(true);
        const data = await clienteService.getAll();
        setClientes(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Error al cargar clientes",
          variant: "destructive",
        });
      } finally {
        setLoadingClientes(false);
      }

      // Cargar promociones
      try {
        setLoadingPromociones(true);
        const promocionesData = await notificacionService.obtenerPromociones();
        setPromociones(promocionesData);
        if (promocionesData.length > 0) {
          setSelectedPromocionId(promocionesData[0].idPromocion.toString());
        }
      } catch (error: any) {
        console.error("Error al cargar promociones:", error);
        // No mostrar error si no hay promociones, el usuario puede ingresar el ID manualmente
      } finally {
        setLoadingPromociones(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClientToggle = (idCliente: number) => {
    setSelectedClientIds((prev) =>
      prev.includes(idCliente)
        ? prev.filter((id) => id !== idCliente)
        : [...prev, idCliente]
    );
  };

  const handleSelectAll = () => {
    if (selectedClientIds.length === clientes.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(clientes.map((c) => c.idCliente!).filter((id) => id !== undefined));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el mensaje a enviar",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPromocionId) {
      toast({
        title: "Error",
        description: "Por favor selecciona una promoción",
        variant: "destructive",
      });
      return;
    }

    if (!idUsuario) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar notificaciones",
        variant: "destructive",
      });
      return;
    }

    if (recipients === "manual" && selectedClientIds.length === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona al menos un cliente",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      let clientIdsToSend: number[] = [];
      
      if (recipients === "all") {
        // Envío masivo a todos los clientes
        clientIdsToSend = clientes.map((c) => c.idCliente!).filter((id) => id !== undefined);
      } else if (recipients === "manual") {
        // Envío masivo solo a clientes seleccionados
        clientIdsToSend = selectedClientIds;
      } else {
        // Para "dogs" y "cats" - por ahora usamos todos los clientes
        // En el futuro se puede filtrar por tipo de mascota en las preferencias
        clientIdsToSend = clientes.map((c) => c.idCliente!).filter((id) => id !== undefined);
      }

      if (clientIdsToSend.length === 0) {
        toast({
          title: "Error",
          description: "No hay clientes seleccionados para enviar",
          variant: "destructive",
        });
        return;
      }

      // Siempre usar envío masivo
      const request: EmailMasivoRequest = {
        idClientes: clientIdsToSend,
        idPromocion: parseInt(selectedPromocionId),
        idUsuario: idUsuario,
        mensajePersonalizado: message,
      };
      
      const response = await notificacionService.enviarEmailMasivo(request);
      
      toast({
        title: "Éxito",
        description: response.message || "Promociones enviadas por email exitosamente",
      });

      // Limpiar formulario
      setMessage("");
      setSelectedClientIds([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al enviar las promociones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Envío de Promociones</h1>
            </div>
            <p className="text-muted-foreground">
              Envía correos electrónicos a tus clientes para informarles sobre nuevas ofertas o descuentos
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nueva Promoción</CardTitle>
              <CardDescription>Configura tu mensaje promocional y selecciona los destinatarios</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleccionar Promoción */}
                <div className="space-y-3">
                  <Label htmlFor="promocion">Promoción</Label>
                  {loadingPromociones ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Cargando promociones...</span>
                    </div>
                  ) : promociones.length > 0 ? (
                    <>
                      <Input
                        placeholder="Buscar promoción por nombre"
                        value={promocionFilter}
                        onChange={(e) => setPromocionFilter(e.target.value)}
                      />
                      <Select
                        value={selectedPromocionId}
                        onValueChange={setSelectedPromocionId}
                        required
                      >
                        <SelectTrigger id="promocion">
                          <SelectValue placeholder="Selecciona una promoción" />
                        </SelectTrigger>
                        <SelectContent>
                          {promociones
                            .filter((p) =>
                              p.nombre.toLowerCase().includes(promocionFilter.toLowerCase())
                            )
                            .map((promocion) => (
                              <SelectItem
                                key={promocion.idPromocion}
                                value={promocion.idPromocion.toString()}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{promocion.nombre}</span>
                                  {promocion.descripcion && (
                                    <span className="text-xs text-muted-foreground">
                                      {promocion.descripcion}
                                    </span>
                                  )}
                                  {promocion.tipoDescuento && promocion.valorDescuento && (
                                    <span className="text-xs text-muted-foreground">
                                      {promocion.tipoDescuento === "PORCENTAJE"
                                        ? `${promocion.valorDescuento}% descuento`
                                        : `$${promocion.valorDescuento} descuento`}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      {/* Resumen de la promoción seleccionada (solo lectura) */}
                      {selectedPromocionId && (
                        <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                          {(() => {
                            const p = promociones.find(
                              (x) => x.idPromocion.toString() === selectedPromocionId
                            );
                            if (!p) return null;
                            return (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Estado</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {p.estado ? 'Activa' : 'Inactiva'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <div className="text-xs text-muted-foreground">Nombre</div>
                                    <div className="text-sm font-medium">{p.nombre}</div>
                                  </div>
                                  {p.tipoDescuento && (
                                    <div>
                                      <div className="text-xs text-muted-foreground">Descuento</div>
                                      <div className="text-sm font-medium">
                                        {p.tipoDescuento === 'PORCENTAJE' ? `${p.valorDescuento}%` : `$${p.valorDescuento}`}
                                      </div>
                                    </div>
                                  )}
                                  {p.fechaInicio && (
                                    <div>
                                      <div className="text-xs text-muted-foreground">Fecha inicio</div>
                                      <div className="text-sm">{p.fechaInicio}</div>
                                    </div>
                                  )}
                                  {p.fechaFin && (
                                    <div>
                                      <div className="text-xs text-muted-foreground">Fecha fin</div>
                                      <div className="text-sm">{p.fechaFin}</div>
                                    </div>
                                  )}
                                  {p.categoriaAplicable && (
                                    <div>
                                      <div className="text-xs text-muted-foreground">Categoría</div>
                                      <div className="text-sm">{p.categoriaAplicable}</div>
                                    </div>
                                  )}
                                </div>
                                {p.descripcion && (
                                  <div>
                                    <div className="text-xs text-muted-foreground">Descripción</div>
                                    <div className="text-sm leading-relaxed">{p.descripcion}</div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="promocion"
                        type="number"
                        min="1"
                        placeholder="Ingresa el ID de la promoción"
                        value={selectedPromocionId}
                        onChange={(e) => setSelectedPromocionId(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        No se encontraron promociones. Ingresa el ID manualmente.
                      </p>
                    </div>
                  )}
                </div>

                {/* Usuario que envía */}
                {idUsuario ? (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Usuario</div>
                    <div className="text-sm font-medium">{`ID ${idUsuario}`}</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="idUsuario">ID de Usuario</Label>
                    <Input
                      id="idUsuario"
                      type="number"
                      min="1"
                      placeholder="Ingresa tu ID de usuario"
                      value={""}
                      onChange={(e) => setIdUsuario(parseInt(e.target.value || '0', 10) || null)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">No se pudo obtener el ID desde el token.</p>
                  </div>
                )}

                {/* Asunto removido: solo se envía mensajePersonalizado */}

                {/* Cuerpo del mensaje */}
                <div className="space-y-2">
                  <Label htmlFor="message">Cuerpo del mensaje</Label>
                  <Textarea
                    id="message"
                    placeholder="Hola (Nombre), esta semana tenemos 20% de descuento en juguetes para perros no te lo pierdas"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px]"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Seleccionar destinatarios */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Seleccionar destinatarios</Label>
                  <RadioGroup value={recipients} onValueChange={setRecipients} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="cursor-pointer font-normal">
                        Todos los clientes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dogs" id="dogs" />
                      <Label htmlFor="dogs" className="cursor-pointer font-normal">
                        Clientes con perros
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cats" id="cats" />
                      <Label htmlFor="cats" className="cursor-pointer font-normal">
                        Clientes con gatos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="cursor-pointer font-normal">
                        Seleccionar manualmente
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Selección manual de clientes */}
                  {recipients === "manual" && (
                    <div className="space-y-3 mt-4 pl-6 border-l-2 border-border">
                      {loadingClientes ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              Seleccionar clientes ({selectedClientIds.length} seleccionados)
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleSelectAll}
                            >
                              {selectedClientIds.length === clientes.length
                                ? "Deseleccionar todos"
                                : "Seleccionar todos"}
                            </Button>
                          </div>
                          <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                            {clientes.map((cliente) => (
                              <div
                                key={cliente.idCliente}
                                className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
                              >
                                <Checkbox
                                  id={`cliente-${cliente.idCliente}`}
                                  checked={selectedClientIds.includes(cliente.idCliente!)}
                                  onCheckedChange={() =>
                                    handleClientToggle(cliente.idCliente!)
                                  }
                                />
                                <Label
                                  htmlFor={`cliente-${cliente.idCliente}`}
                                  className="cursor-pointer flex-1"
                                >
                                  {cliente.nombre} {cliente.apellido} - {cliente.email}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>


                {/* Botón enviar */}
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  size="lg"
                  disabled={loading || loadingClientes || loadingPromociones}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar por Email"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PromotionsPage;
