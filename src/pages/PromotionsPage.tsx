import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sidebar } from "@/components/Sidebar";
import { Mail, Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const PromotionsPage = () => {
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("all");
  const [manualRecipients, setManualRecipients] = useState<string[]>([""]);
  const [sendNow, setSendNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const { toast } = useToast();

  const handleAddRecipient = () => {
    setManualRecipients([...manualRecipients, ""]);
  };

  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...manualRecipients];
    newRecipients[index] = value;
    setManualRecipients(newRecipients);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Promoción enviada",
      description: sendNow 
        ? "La promoción ha sido enviada exitosamente" 
        : `La promoción ha sido programada para ${scheduledDate ? format(scheduledDate, "PPP", { locale: es }) : ""}`,
    });
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
              Envía correos o mensajes SMS a tus clientes para informarles sobre nuevas ofertas o descuentos
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nueva Promoción</CardTitle>
              <CardDescription>Configura tu mensaje promocional y selecciona los destinatarios</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Canal de envío */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Canal de envío</Label>
                  <RadioGroup value={channel} onValueChange={setChannel} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="cursor-pointer font-normal">
                        Correo electrónico
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms" className="cursor-pointer font-normal">
                        SMS
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Asunto */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input
                    id="subject"
                    placeholder="Ej: ¡Descuento especial para tu mascota!"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

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

                  {/* Inputs manuales */}
                  {recipients === "manual" && (
                    <div className="space-y-3 mt-4 pl-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {manualRecipients.map((recipient, index) => (
                          <Input
                            key={index}
                            placeholder="Inserte destinatario"
                            value={recipient}
                            onChange={(e) => handleRecipientChange(index, e.target.value)}
                          />
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddRecipient}
                        className="w-full md:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar otro destinatario
                      </Button>
                    </div>
                  )}
                </div>

                {/* Programar */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Programar</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendNow"
                        checked={sendNow}
                        onCheckedChange={(checked) => setSendNow(checked as boolean)}
                      />
                      <Label htmlFor="sendNow" className="cursor-pointer font-normal">
                        Enviar ahora
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="schedule"
                        checked={!sendNow}
                        onCheckedChange={(checked) => setSendNow(!(checked as boolean))}
                      />
                      <Label htmlFor="schedule" className="cursor-pointer font-normal">
                        Seleccionar fecha
                      </Label>
                    </div>
                  </div>

                  {!sendNow && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full md:w-[280px] justify-start text-left font-normal mt-2",
                            !scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledDate ? format(scheduledDate, "PPP", { locale: es }) : "Ingresa la fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Botón enviar */}
                <Button type="submit" className="w-full md:w-auto" size="lg">
                  Enviar
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
