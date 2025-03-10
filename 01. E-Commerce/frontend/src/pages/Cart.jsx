import CartItem from "../components/Cart/CartItem";
import CalculateTotals from "../components/Cart/CalculateTotals";

// redux
import { useSelector } from "react-redux";

const Cart = () => {
  const { cart } = useSelector(state => state.cart);

  return (
    <section className="section">
      <div className="section-title">
        <h2>cart</h2>
      </div>

      {cart.length === 0 ? (
        <h1>you dont have anything in cart</h1>
      ) : (
        <div className="section-center cart-center">
          <article className="cart-container">
            {cart.map(item => {
              return <CartItem key={item.id} {...item} />;
            })}
          </article>

          <CalculateTotals />
        </div>
      )}
    </section>
  );
};

export default Cart;
