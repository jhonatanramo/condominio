import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Index } from "./pages/Index";
import { LandingPages } from "./pages/Landigpages"; // Ajustado al nombre correcto
import { Prueba } from "./pages/P_reportes";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/prueba" element={<Prueba />} />
        <Route path="/landing" element={<LandingPages />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;