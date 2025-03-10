// stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  return (
    <section className="section">
      <div className="section-center checkout-center">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </section>
  );
};

export default Checkout;
