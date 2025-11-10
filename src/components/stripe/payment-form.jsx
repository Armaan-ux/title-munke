import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { addCard } from "../service/userAdmin";
import { color } from "motion";
import { Button } from "../ui/button";
const appearance = {
  
    rules: {
      // '.Tab': {
      //   border: '1px solid #E0E6EB',
      //   boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
      // },

      // '.Tab:hover': {
      //   color: 'var(--colorText)',
      // },

      // '.Tab--selected': {
      //   borderColor: '#E0E6EB',
      //   boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
      // },
      '.Input': {
      color: 'var(--color-foreground)',
      backgroundColor: '#F5F0EC',
      border: '1px solid #BEA999',
      borderRadius: '10px',
      height: '50px',
      width: '100%',
      padding: '12px',
      fontSize: '1rem',
      transition: 'color 0.2s, box-shadow 0.2s',
      outline: 'none',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    '.Input:focus': {
      borderColor: '#BEA999',
      boxShadow: '0 0 0 3px rgba(196, 171, 153, 0.5)',
    },
    '.Input:disabled': {
      opacity: '0.5',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
    '.Input--invalid': {
      borderColor: 'var(--color-destructive)',
      boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.2)',
    },
    ".Label": {
      color: "#3D2014",
      fontWeight: 500,
      marginBottom: "10px"
    }
    }
  };

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
    else {
      console.log("Card saved successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe}
        variant="secondary"
        size="lg"
        className="mt-4"
      >
        Save Card
      </Button>
    </form>
  );
}

export default function PaymentSetup({ userId }) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const init = async () => {
      // const res = await fetch("https://gia0egoc93.execute-api.us-east-1.amazonaws.com/dev/stripe", {
      //   method: "POST",
      //   // headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId, userType: "broker" }),
      // });

      const data = await addCard(userId);
      console.log('data -> ', data)
      setClientSecret(data.clientSecret);
    };
    init();
  }, [userId]);

  // 👉 Use clientSecret as an option to <Elements>
  const options = {
    clientSecret, 
    appearance,
  };
// return <Elements stripe={stripePromise} options={options}>
//       <PaymentForm />
//     </Elements>
  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
  ) : (
    <p>Loading...</p>
  );
}
