import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Card
      </button>
    </form>
  );
}

export default function PaymentSetup({ userId }) {
//   const [clientSecret, setClientSecret] = useState("");

//   useEffect(() => {
//     const init = async () => {
//       const res = await fetch("/create-setup-intent", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });
//       const data = await res.json();
//       setClientSecret(data.clientSecret);
//     };
//     init();
//   }, [userId]);

  // 👉 Use clientSecret as an option to <Elements>
  const options = {
    // clientSecret, 
    appearance: { theme: "stripe" },
  };
return <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
//   return clientSecret ? (
//     <Elements stripe={stripePromise} options={options}>
//       <PaymentForm />
//     </Elements>
//   ) : (
//     <p>Loading...</p>
//   );
}
