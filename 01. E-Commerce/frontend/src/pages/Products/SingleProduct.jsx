import Copyright from "../../components/Copyright";
import { Link } from "react-router";
import { formatPrice } from "../../helpers/formatPrice";
import Loading from "../../components/Loading";

// react icons
import { FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// router
import { useParams } from "react-router";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getSingleProductThunk } from "../../redux/features/products/productsThunk";
import { addToCart, hideAlert } from "../../redux/features/cart/cartSlice";

// react
import { useEffect, useState, useRef } from "react";
import Comments from "../../components/Comments";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Alert from "../../components/Cart/Alert";

const colorNames = {
  white: "#FFFFFF",
  black: "#000000",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  gray: "#808080",
  silver: "#C0C0C0",
};

const hexToRgb = hex => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map(x => x + x)
      .join("");
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
};

const colorDistance = (rgb1, rgb2) => {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};

const getClosestColor = hex => {
  const rgbInput = hexToRgb(hex);
  let closestColorName = null;
  let smallestDistance = Infinity;

  for (const [name, hexCode] of Object.entries(colorNames)) {
    const rgbColor = hexToRgb(hexCode);
    const distance = colorDistance(rgbInput, rgbColor);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestColorName = name;
    }
  }
  return closestColorName;
};

const SingleProduct = () => {
  const { singleProduct, loading, alert } = useSelector(
    state => state.products
  );
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(1);
  const { id } = useParams();

  const prevSlideRef = useRef(null);
  const nextSlideRef = useRef(null);

  const decrease = () => {
    setAmount(prevAmount => {
      if (prevAmount < 2) {
        return 1;
      }
      return prevAmount - 1;
    });
  };

  const increase = () => {
    setAmount(prevAmount => {
      if (prevAmount === stock) {
        return stock;
      }
      return prevAmount + 1;
    });
  };

  const handleAddToCart = product => {
    const newObj = {
      id: product.id,
      name: product.name,
      company: product.company,
      category: product.category,
      price: product.price,
      amount,
      colors: product.colors,
      image: product.images[0].src,
      shipping: product.shipping,
      stock: product.stock,
    };

    dispatch(addToCart(newObj));

   
      const timeout = setTimeout(() => {
        dispatch(hideAlert());
      }, 3000);

      return () => clearTimeout(timeout);
  
  };

  useEffect(() => {
    dispatch(getSingleProductThunk(id));
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  const {
    id: productId,
    name,
    images,
    price,
    description,
    category,
    company,
    stock,
    colors,
    user,
    shipping,
  } = singleProduct;

  return (
    <>
      <main className="section single-product-section">
        <div className="section-center">
          <article className="single-product-path-container">
            <Link to={"/"} className="path-btn">
              home
            </Link>{" "}
            {"> "}
            <Link to={"/products"} className="path-btn">
              products
            </Link>
            <h4 className="added-by">
              added by: {user?.username && user.username}
            </h4>
          </article>

          <div className="single-product-wrapper">
            <header className="single-product-header">
              <h3>{name}</h3>
              <h3 className="product-price">{price && formatPrice(price)}</h3>
            </header>

            <div className="swiper-container">
              {images?.length > 1 && (
                <>
                  <button className="prev-slide swiper-btn" ref={prevSlideRef}>
                    <FaChevronLeft />
                  </button>
                  <button className="next-slide swiper-btn" ref={nextSlideRef}>
                    <FaChevronRight />
                  </button>
                </>
              )}

              <Swiper
                effect="coverflow"
                grabCursor={true}
                slidesPerView={"auto"}
                centeredSlides={true}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                navigation={{
                  prevEl: prevSlideRef.current,
                  nextEl: nextSlideRef.current,
                }}
                pagination={{
                  dynamicBullets: true,
                }}
                spaceBetween={30}
                modules={[EffectCoverflow, Pagination, Navigation]}
              >
                {images?.length > 0 &&
                  images.map((item, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={item.src}
                          alt={item?.name || "default image"}
                          className="single-product-img"
                        />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>

            <article className="single-product-description-container">
              <h3>description:</h3>
              <p>{description}</p>
            </article>

            <article className="single-product-info-container">
              <h3>product details:</h3>
              <div className="single-product-info">
                <p>product id</p>
                <p>{productId}</p>
              </div>
              <div className="single-product-info">
                <p>company</p>
                <p>{company}</p>
              </div>
              <div className="single-product-info">
                <p>category</p>
                <p>{category}</p>
              </div>
              <div className="single-product-info">
                <p>color</p>
                <p>{colors?.map(color => getClosestColor(color))}</p>
              </div>
              <div className="single-product-info">
                <p>stock</p>
                <p>{stock}</p>
              </div>
              <div className="single-product-info">
                <p>free shipping</p>
                <p>{shipping ? "yes" : "no"}</p>
              </div>
            </article>

            {stock === 0 ? (
              <h1 className="empty-item">out of stock</h1>
            ) : (
              <>
                <div className="amount-wrapper">
                  <article className="amount-container">
                    <button className="amount-btn" onClick={decrease}>
                      <FaMinus />
                    </button>
                    <p>{amount}</p>
                    <button className="amount-btn" onClick={increase}>
                      <FaPlus />
                    </button>
                  </article>
                </div>

                <button
                  className="btn btn block single-product-btn"
                  onClick={() => handleAddToCart(singleProduct)}
                >
                  add to cart
                </button>

                <Alert />
              </>
            )}
          </div>

          <Comments />
        </div>
      </main>
      <Copyright />
    </>
  );
};

export default SingleProduct;
