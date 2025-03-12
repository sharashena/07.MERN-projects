import { Link } from "react-router";
import { formatText } from "../../helpers/formatText";
import { formatPrice } from "../../helpers/formatPrice";

// redux
import { useSelector } from "react-redux";

const Featured = () => {
  const { featuredProducts } = useSelector(state => state.products);

  return (
    <section className="section">
      <div className="section-title">
        <h2>featured products</h2>
      </div>
      <div className="section-center products-container featured-container">
        {featuredProducts?.result
          ?.map(product => {
            const { id, name, description, price, images } = product;
            const image = images[0].src;

            return (
              <article className="product" key={id}>
                <Link to={`products/${id}`} className="product-img-link">
                  <img src={image} alt={name} className="product-img" />
                </Link>
                <div className="product-info-container">
                  <h4>{name}</h4>
                  <p className="product-description">
                    {formatText(description)}
                  </p>
                </div>
                <footer className="product-footer">
                  <p className="product-price">{formatPrice(price)}</p>
                  <Link to={`products/${id}`} className="btn detail-btn">
                    see details
                  </Link>
                </footer>
              </article>
            );
          })
          .slice(0, 3)}
      </div>
    </section>
  );
};

export default Featured;
