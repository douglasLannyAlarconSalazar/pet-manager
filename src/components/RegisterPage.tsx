import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint } from "lucide-react";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [petPreference, setPetPreference] = useState("");
  const [accessoryPreference, setAccessoryPreference] = useState("");
  const [medicationPreference, setMedicationPreference] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo validación visual - navegar al dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <PawPrint className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
            <CardDescription>Únete a Pet Manager</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Tu nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-input-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-input-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-input-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petPreference">Preferencias sobre mascotas</Label>
              <Select value={petPreference} onValueChange={setPetPreference} required>
                <SelectTrigger id="petPreference" className="border-input-border focus:border-primary">
                  <SelectValue placeholder="Selecciona tu preferencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="ave">Ave</SelectItem>
                  <SelectItem value="reptil">Reptil</SelectItem>
                  <SelectItem value="roedor">Roedor</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessoryPreference">Preferencias de accesorios y artículos</Label>
              <Select value={accessoryPreference} onValueChange={setAccessoryPreference} required>
                <SelectTrigger id="accessoryPreference" className="border-input-border focus:border-primary">
                  <SelectValue placeholder="Selecciona tu preferencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juguetes">Juguetes</SelectItem>
                  <SelectItem value="collares">Collares y correas</SelectItem>
                  <SelectItem value="camas">Camas y mantas</SelectItem>
                  <SelectItem value="comederos">Comederos y bebederos</SelectItem>
                  <SelectItem value="transportadoras">Transportadoras</SelectItem>
                  <SelectItem value="higiene">Productos de higiene</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicationPreference">Preferencias de productos y medicamentos</Label>
              <Select value={medicationPreference} onValueChange={setMedicationPreference} required>
                <SelectTrigger id="medicationPreference" className="border-input-border focus:border-primary">
                  <SelectValue placeholder="Selecciona tu preferencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguna">Ninguna</SelectItem>
                  <SelectItem value="desparasitantes">Desparasitantes</SelectItem>
                  <SelectItem value="vitaminas">Vitaminas</SelectItem>
                  <SelectItem value="antipulgas">Antipulgas</SelectItem>
                  <SelectItem value="antibioticos">Antibióticos</SelectItem>
                  <SelectItem value="suplementos">Suplementos alimenticios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Registrarse
            </Button>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/" className="text-primary hover:underline">
                  Inicia sesión
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;