import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Index } from "./pages/Index";
import { Crud_usuario } from "./pages/condominio/propietarios";
import Pantalla404 from "./components/Pantalla404";
import { Unidad } from "./pages/condominio/unidad";
import { Tarjeta } from "./components/tarjeta";
import { Agendas } from "./pages/condominio/Agendas"; 
import { Dashboard } from "./pages/condominio/Dashboard";

// Pago Stripe
import Checkout from "./prosesos/Checkout";
import { Crear_Unidad } from "./components/crear_unidad";

// ingreso
import { Ingreso } from "./pages/guardia/ingreso";


// Rutas
import { Visita } from "./pages/usuario/visita";
import { Reserva } from "./pages/usuario/reserva";

// Componente cámara
import CamaraPlacas from "./components/camara/CamaraPlacas";

export function App() {
  return (
    <BrowserRouter>
      <Routes>


        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/tarjeta" element={<Tarjeta />} />
        <Route path="/Agendas" element={<Agendas />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Unidades" element={<Unidad />} />
        <Route path="/checkout" element={<Checkout />} />



        {/* Rutas del condominio */}
        <Route path="/crud_usuario" element={<Crud_usuario />} />
        <Route path="/Crear_Unidad" element={<Crear_Unidad />} />

        {/* Ruta cámara */}
        <Route path="/camara" element={<CamaraPlacas />} />
        <Route path="/Ingreso" element={<Ingreso />} />

        {/* Ruta 404 */}
        <Route path="*" element={<Pantalla404 />} />









        {/*     Usuario */}
      <Route path="/visista" element={<Visita/>}/>
      <Route path="/reserva" element={<Reserva/>}/>







      </Routes>
    </BrowserRouter>
  );
}

export default App;
