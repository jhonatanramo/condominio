import { Barra } from "./../../components/Navigation";
import { useCallback, useState, useEffect } from "react";
import api from "./../../api";

export function Crud_usuario() {
    const [paises, setPaises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState("");
    const [paterno, setPaterno] = useState("");
    const [materno, setMaterno] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pais, setPais] = useState("");
    const [ci, setCi] = useState("");
    const [email, setEmail] = useState("");
    const [clave, setClave] = useState("");

    // Cargar países al montar
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const resp = await api.get("data/paises/");
            setPaises(Array.isArray(resp.data) ? resp.data : []);
        } catch (error) {
            console.error("Error al obtener los países:", error);
            alert("Error al obtener los países");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post("usuario/crear/", {
                nombre,
                paterno,
                materno,
                telefono,
                pais,
                ci,
                email,
                clave
            });
            console.log("Usuario creado", res.data);
            alert("Usuario creado correctamente");
            
            // Limpiar formulario después de éxito
            setNombre("");
            setPaterno("");
            setMaterno("");
            setTelefono("");
            setPais("");
            setCi("");
            setEmail("");
            setClave("");
            
        } catch (error) {
            console.error("Error al registrar al usuario:", error);
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert("Error al registrar al usuario");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Barra>
            <fieldset>
                <legend>Datos del propietario</legend>
                <form onSubmit={handleSubmit}>
                    {/* Campo Nombre */}
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    /><br />
                    
                    {/* Campo Apellido Paterno */}
                    <label htmlFor="paterno">Apellido Paterno</label>
                    <input
                        type="text"
                        id="paterno"
                        value={paterno}
                        onChange={(e) => setPaterno(e.target.value)}
                        required
                    /><br />
                    
                    {/* Campo Apellido Materno */}
                    <label htmlFor="materno">Apellido Materno</label>
                    <input
                        type="text"
                        id="materno"
                        value={materno}
                        onChange={(e) => setMaterno(e.target.value)}
                    /><br />
                    
                    {/* Campo Teléfono */}
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    /><br />
                    
                    {/* Campo CI */}
                    <label htmlFor="ci">Cédula de Identidad</label>
                    <input
                        type="text"
                        id="ci"
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                    /><br />
                    
                    {/* Campo Email */}
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /><br />
                    
                    {/* Campo Clave */}
                    <label htmlFor="clave">Clave</label>
                    <input
                        type="password"
                        id="clave"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                    /><br />
                    
                    {/* Selector de País */}
                    <label htmlFor="pais">País</label>
                    <select
                        id="pais"
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un país</option>
                        {paises.map((paisItem) => (
                            <option key={paisItem.id} value={paisItem.id}>
                                {paisItem.nombre}
                            </option>
                        ))}
                    </select><br />

                    <button type="submit" disabled={loading}>
                        {loading ? "Procesando..." : "Registrar Usuario"}
                    </button>
                </form>
            </fieldset>
        </Barra>
    );
}