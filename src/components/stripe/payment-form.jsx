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

function PaymentForm({ onPaymentSuccess, planId }) {
  const { user, setUser, newPlanType } = useUser();
  const { pathname } = useLocation();
  const [type, setType] = useState("");
  const userClickedRef = useRef(false);
  const stripe = useStripe();
  const elements = useElements();
  console.log("user", user);
  const shouldForceRedirect = !!newPlanType;
console.log("shouldForceRedirect11111111111111111",shouldForceRedirect)
console.log("newPlanType11111111111111111111",newPlanType)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    let result;
    if (user?.isAddCard || planId === "PAY_AS_YOU_GO") {
      console.log("confirm setup called");
      result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${pathname}?isCardAdded=true`,
        },
        ...(shouldForceRedirect ? {} : { redirect: "if_required" }),
      });
    } else {
      result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${pathname}?isPaymentSuccessful=true`,
        },
        ...(shouldForceRedirect ? {} : { redirect: "if_required" }),
      });
    }
    console.log("result", result);

    if (result?.error) {
      toast.error(result.error.message || "Something went wrong.");
      return;
    }

    if (
      result?.paymentIntent?.status === "succeeded" ||
      result?.setupIntent?.status === "succeeded"
    ) {
      console.log("Payment/Setup successful");
      onPaymentSuccess?.();
    }

    setUser((prev) => ({ ...prev, isAddCard: false }));
  };

  useEffect(() => {
    if (!elements) return;
    const paymentElement = elements.getElement("payment");

    if (!paymentElement) return;
    paymentElement.on("change", (event) => {
      if (!userClickedRef?.current) {
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
        {user?.isAddCard || planId === "PAY_AS_YOU_GO"
          ? "Save Card"
          : "Make Payment"}
      </Button>
    </form>
  );
}

export default function PaymentSetup({ planId = "", onPaymentSuccess }) {
  const [clientSecret, setClientSecret] = useState("");
  const { user, newPlanType } = useUser();
  console.log("user12312312312312312312", user);
  const userType =
    user?.signInUserSession?.idToken?.payload["cognito:groups"]?.[0];
  const plan = newPlanType || planId;
  const membershipMutation = useMutation({
    mutationFn: () =>
      addCard(
        user?.attributes?.sub,
        userType,
        user?.isAddCard || planId === "PAY_AS_YOU_GO" ? "add-card" : "subscribe",
        plan,
      ),
    onSuccess: (data) => setClientSecret(data.clientSecret),
  });
  const init = async () => {
    const data = await addCard(user?.attributes?.sub, userType);
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    if (user?.attributes?.sub)
      // init();
      membershipMutation.mutate();
  }, [user?.attributes?.sub]);

  const options = {
    clientSecret,
    appearance,
    disableDevtools: true,
  };

  return (
    <>
      {membershipMutation?.isPending && <CenterLoader />}
      {membershipMutation?.isError && (
        <ShowError message={membershipMutation?.error?.response?.data?.error} />
      )}
      {membershipMutation?.isSuccess && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onPaymentSuccess={onPaymentSuccess} planId={planId} />
        </Elements>
      )}
    </>
  );
}
