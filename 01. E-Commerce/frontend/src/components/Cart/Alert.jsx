import { useSelector } from "react-redux";

const Alert = () => {
  const { alert } = useSelector(state => state.cart);

  return (
    <div className={`alert-container ${alert.show ? "show-cart-alert" : ""}`}>
      <p className={`cart-alert alert-${alert.type}`}>{alert.msg}</p>
    </div>
  );
};

export default Alert;
