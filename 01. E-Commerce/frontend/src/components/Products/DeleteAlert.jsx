import { useSelector, useDispatch } from "react-redux";
import { closeDeleteAlert } from "../../redux/features/products/productsSlice";
import { deleteProductThunk } from "../../redux/features/products/productsThunk";

const DeleteAlert = () => {
  const { deleteAlert, loadingAlert, deleteProductId } = useSelector(
    state => state.products
  );
  const dispatch = useDispatch();

  const handleCloseAlert = () => {
    dispatch(closeDeleteAlert());
  };

  const handleDeleteProduct = () => {
    dispatch(deleteProductThunk(deleteProductId));
  };

  return (
    <div className={`alert-overlay ${deleteAlert.show ? "show-alert" : ""}`}>
      <article className="alert">
        {loadingAlert ? (
          <div className="loading-alert" />
        ) : (
          <>
            <h3>{deleteAlert.msg}</h3>

            <button
              type="button"
              className="alert-danger"
              onClick={handleDeleteProduct}
            >
              delete
            </button>
            <button type="button" className="btn" onClick={handleCloseAlert}>
              cancel
            </button>
          </>
        )}
      </article>
    </div>
  );
};

export default DeleteAlert;
