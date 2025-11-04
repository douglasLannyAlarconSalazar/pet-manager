import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Loader2, TrendingUp, Search } from "lucide-react";
import { reporteService, ClienteFrecuente } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const FrequentCustomersReportPage = () => {
  const [clientesFrecuentes, setClientesFrecuentes] = useState<
    ClienteFrecuente[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Cargar reporte de clientes frecuentes
  const loadReporte = async () => {
    try {
      setLoading(true);
      const data = await reporteService.getClientesFrecuentes();
      // Ordenar por número de compras descendente
      const sorted = data.sort((a, b) => b.numeroCompras - a.numeroCompras);
      setClientesFrecuentes(sorted);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar el reporte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReporte();
  }, []);

  // Exportar reporte (función básica)
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Nombre", "Email", "Número de Compras", "Total Gastado", "Puntos Fidelidad"],
        ...clientesFrecuentes.map((c) => [
          c.nombre,
          c.email,
          c.numeroCompras,
          c.totalGastado,
          c.puntosFidelidad || 0,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clientes_frecuentes_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Éxito",
      description: "Reporte exportado correctamente",
    });
  };

  // Calcular estadísticas
  const totalClientes = clientesFrecuentes.length;
  const totalCompras = clientesFrecuentes.reduce(
    (sum, c) => sum + c.numeroCompras,
    0
  );
  const montoTotal = clientesFrecuentes.reduce(
    (sum, c) => sum + Number(c.totalGastado || 0),
    0
  );
  const promedioCompras =
    totalClientes > 0 ? (totalCompras / totalClientes).toFixed(2) : "0";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                  Reporte de Clientes Frecuentes
                </h1>
                <p className="text-muted-foreground">
                  Análisis de clientes más activos y sus hábitos de compra
                </p>
              </div>
              <Button onClick={loadReporte} variant="outline">
                Actualizar
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Clientes Frecuentes
                  </CardTitle>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalClientes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total de clientes en el reporte
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Compras
                  </CardTitle>
                  <BarChart3 className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCompras}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compras realizadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monto Total
                  </CardTitle>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${montoTotal.toLocaleString("es-CO")}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor acumulado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Promedio de Compras
                  </CardTitle>
                  <BarChart3 className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{promedioCompras}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por cliente
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Report Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes Frecuentes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : clientesFrecuentes.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay datos disponibles</p>
                      <p className="text-sm mt-2">
                        No se encontraron clientes frecuentes en el sistema
                      </p>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ranking</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Número de Compras</TableHead>
                        <TableHead className="text-right">Total Gastado</TableHead>
                        <TableHead>Puntos Fidelidad</TableHead>
                        <TableHead>Preferencias</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientesFrecuentes.map((cliente, index) => (
                        <TableRow key={cliente.email}>
                          <TableCell>
                            <Badge
                              variant={
                                index === 0
                                  ? "default"
                                  : index === 1
                                  ? "secondary"
                                  : index === 2
                                  ? "outline"
                                  : "outline"
                              }
                            >
                              #{index + 1}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {cliente.nombre}
                          </TableCell>
                          <TableCell>{cliente.email}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">
                              {cliente.numeroCompras}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${Number(cliente.totalGastado || 0).toLocaleString("es-CO")}
                          </TableCell>
                          <TableCell>
                            {cliente.puntosFidelidad || 0}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {cliente.preferencias && cliente.preferencias.length > 0 ? (
                                cliente.preferencias.slice(0, 2).map((pref, idx) => (
                                  <span key={idx} className="text-xs text-muted-foreground">
                                    {pref}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
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
    </div>
  );
};

export default FrequentCustomersReportPage;

