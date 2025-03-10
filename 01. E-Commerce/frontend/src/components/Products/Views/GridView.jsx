import { Link } from "react-router";
import { formatText } from "../../../helpers/formatText";
import { formatPrice } from "../../../helpers/formatPrice";

// react
import { memo } from "react";

// redux
import { useSelector } from "react-redux";

const GridView = () => {
  const { filteredProducts } = useSelector(state => state.products);

  return (
    <div className="products-container">
      {filteredProducts?.result?.map(product => {
        const { id, name, description, price, images } = product;
        const image = images[0].src;

        return (
          <article className="product" key={id}>
            <Link to={`/products/${id}`} className="product-img-link">
              <img
                src={image}
                alt={name}
                className={`product-img ${images[0].name ? "" : "default-img"}`}
              />
            </Link>
            <div className="product-info-container">
              <h4>{name}</h4>
              <p className="product-description">{formatText(description)}</p>
            </div>
            <footer className="product-footer">
              <p className="product-price">{formatPrice(price)}</p>
              <Link to={`/products/${id}`} className="btn detail-btn">
                see details
              </Link>
            </footer>
          </article>
        );
      })}
    </div>
  );
};

export default memo(GridView);
