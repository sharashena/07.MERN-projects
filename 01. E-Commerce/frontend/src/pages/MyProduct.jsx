// react
import { useEffect, useState, useRef } from "react";

// react icons
import { BsThreeDotsVertical } from "react-icons/bs";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserProductsThunk } from "../redux/features/products/productsThunk";
import {
  openModal,
  openDeleteAlert,
} from "../redux/features/products/productsSlice";

import { formatPrice } from "../helpers/formatPrice";
import { formatText } from "../helpers/formatText";
import Loading from "../components/Loading";
import Alert from "../components/Products/Alert";

// router
import { Link } from "react-router";
import DeleteAlert from "../components/Products/DeleteAlert";

const MyProduct = () => {
  const {
    currentUserProducts,
    loading,
    alert,
    deleteAlert,
  } = useSelector(state => state.products);
  const dispatch = useDispatch();

  const [openId, setOpenId] = useState(null);
  const dropdownRef = useRef(null);

  const outsideClick = e => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenId(null);
    }
  };

  const openDropdown = id => setOpenId(openId === id ? null : id);

  const handleOpenModal = product => {
    dispatch(openModal(product));
  };

  const handleOpenDeleteAlert = id => {
    dispatch(openDeleteAlert(id));
  };

  useEffect(() => {
    window.addEventListener("click", outsideClick);
    return () => window.removeEventListener("click", outsideClick);
  }, []);

  useEffect(() => {
    dispatch(getCurrentUserProductsThunk());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="section">
      {alert.show && <Alert />}
      {deleteAlert.show && <DeleteAlert />}
      <div className="section-title">
        <h2>my products</h2>
      </div>
      {currentUserProducts.length === 0 ||
      currentUserProducts?.result?.length === 0 ? (
        <h1>there is no products added yet</h1>
      ) : (
        <div className="section-center products-container">
          {currentUserProducts?.result?.map(product => {
            const { id, name, description, price, images } = product;
            const image = images[0]?.src;

            return (
              <article className="product my-product" key={id}>
                <Link to={`/products/${id}`} className="product-img-link">
                  <img
                    title={name || "default image"}
                    src={image}
                    alt={name || "default image"}
                    className={`product-img ${
                      images[0].name ? "" : "default-img"
                    }`}
                  />
                </Link>
                <button
                  className="three-dots"
                  onClick={e => {
                    e.stopPropagation();
                    openDropdown(id);
                  }}
                >
                  <BsThreeDotsVertical />
                </button>
                <div
                  className={`my-product-dropdown ${
                    openId === id ? "show-product-dropdown" : ""
                  }`}
                  ref={dropdownRef}
                >
                  <button
                    className="dropdown-btn"
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenModal(product);
                    }}
                  >
                    update
                  </button>
                  <button
                    className="dropdown-btn"
                    onClick={() => handleOpenDeleteAlert(id)}
                  >
                    delete
                  </button>
                </div>
                <div className="product-info-container">
                  <h4>{name}</h4>
                  <p className="product-description">
                    {formatText(description)}
                  </p>
                </div>
                <footer className="product-footer">
                  <p className="product-price">
                    {formatPrice(price)}
                  </p>
                  <Link to={`/products/${id}`} className="btn detail-btn">
                    see details
                  </Link>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MyProduct;
