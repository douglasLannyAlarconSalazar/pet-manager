import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCheck,
  FileText,
  CreditCard,
  Settings,
  PawPrint,
  LogOut,
  Mail,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Órdenes", href: "/orders", icon: ShoppingCart },
  { name: "Clientes", href: "/customers", icon: Users },
  { name: "Agentes", href: "/agents", icon: UserCheck },
  { name: "Documentos", href: "/documents", icon: FileText },
  { name: "Transacciones", href: "/transactions", icon: CreditCard },
  { name: "Promociones", href: "/promotions", icon: Mail },
  { name: "Configuración", href: "/settings", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            Pet Manager
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-border space-y-4">
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Soporte
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
          <Settings className="w-4 h-4 mr-2" />
          Configuración
        </Button>
        
        <div className="flex items-center space-x-3 p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" />
            <AvatarFallback>OR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Olivia Rhye
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Super Admin
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-8 h-8"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { Sidebar };