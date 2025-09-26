import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Bell, Plus, Package } from "lucide-react";

const OrdersPage = () => {
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
                placeholder="Buscar órdenes..."
                className="pl-10 border-input-border"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Órdenes</h1>
                <p className="text-muted-foreground">Gestión de pedidos de mascotas</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva orden
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Lista de órdenes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <div className="text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay órdenes disponibles</p>
                    <p className="text-sm mt-2">Las órdenes aparecerán aquí cuando los clientes realicen pedidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;