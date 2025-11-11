import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { addCard } from "../service/userAdmin";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useUser } from "@/context/usercontext";
import { appearance } from "@/utils/constant";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useUser()
  const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          window.location.origin + `/${userType === "broker" ? "broker" : "individual"}/dashboard?isCardAdded=true`,
      },
    });

    if (error) {
      toast.error(error?.message || "Something went wrong.");
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







export default function PaymentSetup() {
  const [clientSecret, setClientSecret] = useState("");
  const {user} = useUser()
  const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
  
  const init = async () => {
    const data = await addCard(user?.attributes?.sub, userType);
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    if(user?.attributes?.sub)
      init();
  }, [user?.attributes?.sub]);


  const options = {
    clientSecret,
    appearance,
  };

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
  ) : (
    <p>Loading...</p>
  );
}
