import { Link } from "react-router";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// react
import { useRef, useEffect } from "react";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// redux
import { useSelector } from "react-redux";

const Hero = () => {
  const { products } = useSelector(state => state.products);
  const prevSlideRef = useRef(null);
  const nextSlideRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && prevSlideRef.current && nextSlideRef.current) {
      swiperRef.current.params.navigation.prevEl = prevSlideRef.current;
      swiperRef.current.params.navigation.nextEl = nextSlideRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [products]);

  return (
    <section className="section hero-section">
      <div className="section-center">
        {products?.result?.length > 0 && (
          <div className="swiper-container">
            <button
              type="button"
              className="prev-slide swiper-btn"
              ref={prevSlideRef}
            >
              <FaChevronLeft />
            </button>

            <button
              type="button"
              className="next-slide swiper-btn"
              ref={nextSlideRef}
            >
              <FaChevronRight />
            </button>

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
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{ dynamicBullets: true }}
              navigation={{
                prevEl: prevSlideRef.current,
                nextEl: nextSlideRef.current,
              }}
              spaceBetween={30}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              onSwiper={swiper => (swiperRef.current = swiper)}
            >
              {products?.result?.map(product => {
                const { id, name, images } = product;
                const image = images[0]?.src || "default.jpg";

                return (
                  <SwiperSlide key={id}>
                    <Link to={`products/${id}`} className="hero-link">
                      <img src={image} alt={name} className="hero-img" />
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        <div className="hero-container">
          <h1>- Your one-stop shop for everything!</h1>
          <h1>- Quality products, unbeatable prices!</h1>
          <h1>- Shop smart, live better!</h1>
          <h1>- Find it here, love it forever!</h1>
          <h1>- Shop today, smile tomorrow!</h1>

          <Link to={"products"} className="btn hero-btn">
            products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
