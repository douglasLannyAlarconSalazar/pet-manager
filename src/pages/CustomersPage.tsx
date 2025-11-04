import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, Users, Loader2, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { clienteService, Cliente } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const CustomersPage = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deleteClienteId, setDeleteClienteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    estado: true,
    puntosFidelidad: 0,
  });
  const { toast } = useToast();

  // Cargar clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  // Filtrar clientes por búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono?.includes(searchTerm)
  );

  // Abrir diálogo para crear/editar
  const handleOpenDialog = (cliente?: Cliente) => {
    if (cliente) {
      setSelectedCliente(cliente);
      setFormData({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        direccion: cliente.direccion || "",
        estado: cliente.estado ?? true,
        puntosFidelidad: cliente.puntosFidelidad || 0,
      });
    } else {
      setSelectedCliente(null);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        estado: true,
        puntosFidelidad: 0,
      });
    }
    setIsDialogOpen(true);
  };

  // Guardar cliente (crear o actualizar)
  const handleSave = async () => {
    try {
      if (selectedCliente?.idCliente) {
        // Actualizar
        await clienteService.update(selectedCliente.idCliente, formData);
        toast({
          title: "Éxito",
          description: "Cliente actualizado correctamente",
        });
      } else {
        // Crear - asegurar que estado tenga valor por defecto
        const clienteToCreate = {
          ...formData,
          estado: formData.estado ?? true,
        } as Omit<Cliente, "idCliente" | "fechaRegistro">;
        await clienteService.create(clienteToCreate);
        toast({
          title: "Éxito",
          description: "Cliente creado correctamente",
        });
      }
      setIsDialogOpen(false);
      loadClientes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar el cliente",
        variant: "destructive",
      });
    }
  };

  // Eliminar cliente
  const handleDelete = async () => {
    if (!deleteClienteId) return;
    try {
      await clienteService.delete(deleteClienteId);
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      });
      setIsDeleteDialogOpen(false);
      setDeleteClienteId(null);
      loadClientes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  // Confirmar eliminación
  const confirmDelete = (idCliente: number) => {
    setDeleteClienteId(idCliente);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-input-border"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Gestión de Clientes
                </h1>
                <p className="text-muted-foreground">
                  Administra los datos de tus clientes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/customers/report")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Reporte
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedCliente ? "Editar Cliente" : "Nuevo Cliente"}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedCliente
                        ? "Modifica los datos del cliente"
                        : "Completa los datos para registrar un nuevo cliente"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre: e.target.value })
                        }
                        placeholder="Nombre"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) =>
                          setFormData({ ...formData, apellido: e.target.value })
                        }
                        placeholder="Apellido"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
                        }
                        placeholder="+1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Textarea
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({ ...formData, direccion: e.target.value })
                        }
                        placeholder="Dirección completa"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="puntosFidelidad">Puntos de Fidelidad</Label>
                      <Input
                        id="puntosFidelidad"
                        type="number"
                        min="0"
                        value={formData.puntosFidelidad || 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            puntosFidelidad: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select
                        value={formData.estado?.toString() || "true"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            estado: value === "true",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activo</SelectItem>
                          <SelectItem value="false">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {/* Stats Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Clientes
                </CardTitle>
                <Users className="w-5 h-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{clientes.length}</div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredClientes.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay clientes disponibles</p>
                      {searchTerm && (
                        <p className="text-sm mt-2">
                          No se encontraron resultados para "{searchTerm}"
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nombre Completo</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes.map((cliente) => (
                        <TableRow key={cliente.idCliente}>
                          <TableCell className="font-medium">
                            {cliente.idCliente}
                          </TableCell>
                          <TableCell>
                            {cliente.nombre} {cliente.apellido}
                          </TableCell>
                          <TableCell>{cliente.email}</TableCell>
                          <TableCell>{cliente.telefono || "-"}</TableCell>
                          <TableCell>
                            {cliente.estado ? (
                              <Badge variant="default">Activo</Badge>
                            ) : (
                              <Badge variant="secondary">Inactivo</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(cliente)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(cliente.idCliente!)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              cliente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomersPage;

