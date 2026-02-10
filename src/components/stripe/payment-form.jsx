import React, { useEffect, useRef, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { CenterLoader } from "../common/Loader";
import ShowError from "../common/ShowError";
import { useLocation } from "react-router-dom";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({onPaymentSuccess}) {
  const {user, setUser} = useUser()
  const {pathname} = useLocation();
  const [type, setType] = useState("");
  const  userClickedRef = useRef(false);
  const stripe = useStripe();
  const elements = useElements();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;

  let result;

  if (user?.isAddCard) {
    result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${pathname}?isCardAdded=true`,
      },
      redirect: "if_required",
    });
  } else {
    result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${pathname}?isPaymentSuccessful=true`,
      },
      redirect: "if_required",
    });
  }

 
  if (result?.error) {
    toast.error(result.error.message || "Something went wrong.");
    return;
  }

 
  if (result?.paymentIntent?.status === "succeeded") {
    onPaymentSuccess?.();
  }

  setUser((prev) => ({ ...prev, isAddCard: false }));
};


  useEffect(() => {
    if (!elements) return;
    const paymentElement = elements.getElement("payment");

    if (!paymentElement) return;
    paymentElement.on("change", (event) => {
      if(!userClickedRef?.current) {
        userClickedRef.current = true;
        return;
      } 
      setType(event?.value?.type);
    });
    return () => paymentElement.off("change");
  }, [elements]);

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
          {user?.isAddCard ? "Save Card" : "Make Payment"}
        </Button>
    </form>
  );
}







export default function PaymentSetup({planId='',onPaymentSuccess}) {
  const [clientSecret, setClientSecret] = useState("");
  const {user} = useUser()
  const userType = user?.signInUserSession?.idToken?.payload['cognito:groups']?.[0];
  const membershipMutation = useMutation({
    mutationFn: () => addCard(user?.attributes?.sub, userType, user?.isAddCard ? "add-card" : "subscribe",planId), 
    onSuccess: (data) =>  setClientSecret(data.clientSecret)
  })
  const init = async () => {
    const data = await addCard(user?.attributes?.sub, userType);
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    if(user?.attributes?.sub)
      // init();
    membershipMutation.mutate()
  }, [user?.attributes?.sub]);


  const options = {
    clientSecret,
    appearance,
    disableDevtools: true,
  };

  return (
    <>
      {membershipMutation?.isPending && <CenterLoader />}
      {membershipMutation?.isError && <ShowError message={membershipMutation?.error?.response?.data?.error}/>}
      {membershipMutation?.isSuccess && 
        <Elements stripe={stripePromise} options={options} >
          <PaymentForm onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      }
    </>
  )
}
