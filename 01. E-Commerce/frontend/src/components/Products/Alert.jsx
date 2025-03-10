import { useSelector, useDispatch } from "react-redux";
import { closeAlert } from "../../redux/features/products/productsSlice";

const Alert = () => {
  const { alert } = useSelector(state => state.products);
  const dispatch = useDispatch();

  const handleCloseAlert = () => {
    dispatch(closeAlert());
  };

  return (
    <div className={`alert-overlay ${alert.show ? "show-alert" : ""}`}>
      <article className="alert">
        <h3>{alert.msg || "product successfully created"}</h3>
        <button type="button" className="btn" onClick={handleCloseAlert}>
          close
        </button>
      </article>
    </div>
  );
};

export default Alert;
