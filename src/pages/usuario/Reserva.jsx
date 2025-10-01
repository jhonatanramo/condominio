import { useState } from "react";
import { Barra } from "../../components/Navigation";
import Checkout from "../../prosesos/Checkout";
import api from "../../api"; // ← aquí importamos la instancia axios

export function Reserva() {
    const [formData, setFormData] = useState({
        idareasocial: "",
        inicio: "",
        fin: "",
        fecha: "",
        cant_gente: "",
        monto: 5000, // monto en centavos ($50.00)
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/agenda/reserva/crear/", formData, {
                withCredentials: true, // 🔑 para sesión de Django
            }).then(res => console.log(res.data))
            .catch(err => console.error(err));

            console.log("✅ Reserva creada:", res.data);
            alert("Reserva creada con éxito!");

        } catch (error) {
            console.error("❌ Error al crear reserva:", error.response?.data || error.message);
            alert("Error al crear la reserva");
        }
    };

    const handlePagoConfirmado = async (success, data) => {
        if (success) {
          try {
            // Prepare payload with the same data used for the payment
            const payload = {
              idareasocial: formData.idareasocial,
              fecha: formData.fecha,
              inicio: formData.inicio,
              fin: formData.fin,
              cant_gente: formData.cant_gente,
              monto: formData.monto, // The amount in cents
              paymentIntentId: data.paymentIntent.id // Save Stripe PaymentIntent ID
            };
      
            // Send reservation data to your Django backend
            const res = await api.post("/agenda/reserva/crear/", payload, {
              withCredentials: true,
            });
      
            console.log("✅ Reserva registrada:", res.data);
            alert("Reserva creada con éxito ✅");
      
          } catch (error) {
            console.error("❌ Error al registrar la reserva:", error);
            alert("Error al registrar la reserva");
            // Here you should handle the critical scenario:
            // Payment was taken but reservation failed. You may need to issue a refund.
          }
        } else {
          console.error("❌ Error en el pago:", data);
        }
      };

    return (
        <Barra>
            <form onSubmit={handleSubmit}>
                <label>Área social</label>
                <select name="idareasocial" onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    <option value="1">Piscina</option>
                    <option value="2">Cancha</option>
                </select><br /><br />

                <label>Hora Inicio</label>
                <input type="time" name="inicio" onChange={handleChange} required /><br /><br />

                <label>Hora Finalizar</label>
                <input type="time" name="fin" onChange={handleChange} required /><br /><br />

                <label>Fecha</label>
                <input type="date" name="fecha" onChange={handleChange} required /><br /><br />

                <label>Cantidad de gente</label>
                <input type="number" name="cant_gente" onChange={handleChange} /><br /><br />

                {/* Checkout */}
                <Checkout 
                    paymentId={"reserva-123"}   
                    amount={formData.monto}     
                    onPagoConfirmado={handlePagoConfirmado}
                />

                <button type="submit">Reservar</button>
            </form>
        </Barra>
    );
}
