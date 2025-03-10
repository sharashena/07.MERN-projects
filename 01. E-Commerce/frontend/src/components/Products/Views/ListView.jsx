import { Link } from "react-router";
import { formatText } from "../../../helpers/formatText";
import { formatPrice } from "../../../helpers/formatPrice";

// react
import { memo } from "react";

// redux
import { useSelector } from "react-redux";

const ListView = () => {
  const { filteredProducts } = useSelector(state => state.products);

  return (
    <div className="products-container-list">
      {filteredProducts?.result?.map(product => {
        const { id, name, category, description, images, price } = product;

        const image = images[0].src;

        return (
          <article className="product-list" key={id}>
            <Link to={`/products/${id}`} className="product-link-list">
              <img
                src={image}
                alt={name}
                className={`product-img-list ${
                  images[0].name ? "" : "default-img"
                }`}
              />
            </Link>
            <div>
              <h4>{name}</h4>
              <h6 className="product-model">{category}</h6>
              <p>{formatText(description)}</p>
            </div>
            <footer className="product-footer-list">
              <p className="product-price product-price-list">
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
  );
};

export default memo(ListView);
