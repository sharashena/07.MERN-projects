import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { formatPrice } from "../../helpers/formatPrice";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItem,
  increaseAmount,
  decreaseAmount,
} from "../../redux/features/cart/cartSlice";

const CartItem = ({
  id,
  name,
  company,
  category,
  price,
  colors,
  amount,
  image,
}) => {
  const { cart } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const deleteCartItem = () => {
    const existingItem = cart.filter(item => item.id !== id);

    dispatch(deleteItem(existingItem));
    localStorage.setItem("cart", JSON.stringify(existingItem));
  };

  const increaseCartItem = () => {
    const newArr = cart.map(item => {
      if (item.id === id) {
        let newAmount = item.amount + 1;

        if (newAmount > item.stock) {
          newAmount = item.stock;
        }

        return { ...item, amount: newAmount };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(newArr));
    dispatch(increaseAmount(newArr));
  };

  const decreaseCartItem = () => {
    const newArr = cart
      .map(item => {
        if (item.id === id) {
          return { ...item, amount: item.amount - 1 };
        }
        return item;
      })
      .filter(item => item.amount !== 0);

    localStorage.setItem("cart", JSON.stringify(newArr));
    dispatch(decreaseAmount(newArr));
  };

  return (
    <div className="cart-item">
      <img src={image} alt={name} className="cart-item-img" />

      <article className="cart-item-info">
        <div className="cart-item-info-header">
          <h4>{name}</h4>
          <h6>{company}</h6>
          <h6>{category}</h6>
          {colors.map((color, index) => {
            return (
              <button
                key={index}
                className="cart-color-btn"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
        <p>{formatPrice(price)}</p>
      </article>

      <article className="cart-amount-container">
        <button className="amount-btn" onClick={decreaseCartItem}>
          <FaMinus />
        </button>
        <p className="cart-amount">{amount}</p>
        <button className="amount-btn" onClick={increaseCartItem}>
          <FaPlus />
        </button>
      </article>

      <button className="cart-remove-btn" onClick={deleteCartItem}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
