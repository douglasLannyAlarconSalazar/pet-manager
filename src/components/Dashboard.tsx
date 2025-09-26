import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  Plus,
  Download,
  MoreHorizontal,
  Users,
  Shield,
} from "lucide-react";
import { Sidebar } from "./Sidebar";

// Datos de ejemplo para la tabla
const users = [
  {
    id: "12345",
    name: "Jaxson Saris",
    email: "olivia@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces",
  },
  {
    id: "12345",
    name: "Angela Velez",
    email: "phoenix@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c89c?w=32&h=32&fit=crop&crop=faces",
  },
  {
    id: "12345",
    name: "Abram Lipschutz",
    email: "lana@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=faces",
  },
  {
    id: "12345",
    name: "Sara Londoño",
    email: "demi@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces",
  },
  {
    id: "12345",
    name: "Stefanie Ser",
    email: "candice@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=faces",
  },
  {
    id: "12345",
    name: "Alejandro Roldán",
    email: "natali@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces",
  },
  {
    id: "12345",
    name: "Alex Molina",
    email: "drew@untitledui.com",
    phone: "+234 8122 4948 47",
    role: "Cliente",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=32&h=32&fit=crop&crop=faces",
  },
];

const Dashboard = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.id + user.name));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "destructive";
      case "Admin":
        return "default";
      default:
        return "secondary";
    }
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
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Gestión de roles</h1>
              <p className="text-muted-foreground">Manejo de usuarios</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Miembros totales
                  </CardTitle>
                  <Users className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">100</div>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo miembro
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Roles
                  </CardTitle>
                  <Shield className="w-5 h-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4</div>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nuevo rol
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Table Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Team Members
                </Button>
                <Button variant="ghost" size="sm">
                  Roles
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Selected dates
                </Button>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedUsers.length === users.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone number</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id + user.name)}
                          onCheckedChange={(checked) =>
                            handleSelectUser(user.id + user.name, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <Button variant="outline">Previous</Button>
              <span className="text-sm text-muted-foreground">Page 1 of 10</span>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;