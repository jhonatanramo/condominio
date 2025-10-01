import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api";

const stripePromise = loadStripe("pk_test_51RRklm4Zqdn7RVeS6rpZkRzHEQb5ZsZ3ud3Lj7SdElZskhVK0c2kbzXX7OHRDbriJ4u1MBNriwpPXUB89lS9LHi900U2jWD6it"); // tu clave pública

function CheckoutForm({ paymentId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llamada al backend para crear PaymentIntent
      const res = await api.post("/create-payment/", { amount, paymentId });
      const { clientSecret } = res.data;

      // Confirmar pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMensaje(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMensaje("✅ Pago realizado con éxito");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error procesando el pago");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pago #{paymentId}</h2>
      <p>Monto: ${amount / 100}</p>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Procesando..." : `Pagar $${amount / 100}`}
        </button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default function Checkout({ paymentId, amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm paymentId={paymentId} amount={amount} />
    </Elements>
  );
}
