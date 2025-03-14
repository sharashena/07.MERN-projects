// stripe
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setError } from "../redux/features/orders/ordersSlice";
import {
  createOrderThunk,
  confirmPayment,
} from "../redux/features/orders/ordersThunk";
import { clearCart } from "../redux/features/cart/cartSlice";

// router
import { useNavigate } from "react-router";

const CheckoutForm = () => {
  const { orders, loading, subtotal, tax, shippingFee, totalPrice, error } =
    useSelector(state => state.orders);
  const { orderItems, paymentMethod } = orders;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const orderData = {
      orderItems,
      paymentMethod,
      subtotal,
      tax,
      shippingFee,
      totalPrice,
    };

    if (orderItems.length === 0) {
      dispatch(
        setError(
          "products are empty for checkout, please procceed checkout without refreshing page"
        )
      );

      const timeout = setTimeout(() => {
        dispatch(setError(""));
      }, 3000);

      return () => clearTimeout(timeout);
    }

    try {
      const response = await dispatch(createOrderThunk(orderData));
      const { clientSecret, orderId } = response.payload;

      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error: err } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (err) {
        dispatch(setError(err.message));
        return;
      } else if (paymentIntent.status === "succeeded") {
        dispatch(confirmPayment(orderId));
        dispatch(clearCart());
        navigate(`/orders/${orderId}/pay`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cardOptions = {
    style: {
      base: {
        color: "#0069e0",
      },
    },
  };

  return (
    <form className="payment" onSubmit={handleSubmit}>
      <h4 className="error-field payment-error">{error}</h4>
      <CardElement options={cardOptions} />
      <p className="test-number">test number: 4242 4242 4242 4242</p>
      <button
        type="submit"
        className="btn btn-block checkout-btn"
        disabled={!stripe || loading}
      >
        {loading ? "processing..." : "pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
