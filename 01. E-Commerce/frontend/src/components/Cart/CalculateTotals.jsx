import { formatPrice } from "../../helpers/formatPrice";

// router
import { Link } from "react-router";

// redux
import { useSelector, useDispatch } from "react-redux";
import { addToOrder } from "../../redux/features/orders/ordersSlice";

const CalculateTotals = () => {
  const { subtotal, shippingFee, tax, totalPrice, cart } = useSelector(
    state => state.cart
  );
  const dispatch = useDispatch();

  const handleAddToOrder = () => {
    dispatch(addToOrder({ cart, subtotal, shippingFee, tax, totalPrice }));
  };

  return (
    <article className="totals-container">
      <div className="totals-info">
        <article className="totals-context">
          <p>subtotal</p>
          <p>{formatPrice(subtotal)}</p>
        </article>
        <article className="totals-context">
          <p>shipping fee</p>
          <p>{formatPrice(shippingFee)}</p>
        </article>
        <article className="totals-context">
          <p>tax</p>
          <p>{formatPrice(tax)}</p>
        </article>
        <article className="totals-context order-total">
          <p>total</p>
          <p>{formatPrice(totalPrice)}</p>
        </article>
      </div>
      <Link
        to={"/checkout"}
        className="btn btn-block"
        onClick={handleAddToOrder}
      >
        checkout
      </Link>
    </article>
  );
};

export default CalculateTotals;
