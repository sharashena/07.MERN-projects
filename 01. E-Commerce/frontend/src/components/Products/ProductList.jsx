import { useState } from "react";
import GridView from "./Views/GridView";
import ListView from "./Views/ListView";
import Loading from "../Loading";

// react icons
import { HiViewGrid, HiViewList } from "react-icons/hi";

// react
import { memo, useEffect } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getProductsThunk } from "../../redux/features/products/productsThunk";

const ProductList = () => {
  const dispatch = useDispatch();
  const [viewIndex, setViewIndex] = useState(0);

  const { filteredProducts, errors, loading } = useSelector(
    state => state.products
  );

  const changeView = index => setViewIndex(index);

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="section">
      <div className="section-title products-section-title">
        <h5>{filteredProducts.numOfProducts || 0} products</h5>
        <div className="views-container">
          {[<HiViewGrid />, <HiViewList />].map((view, index) => {
            return (
              <button
                className={`view-btn ${
                  viewIndex === index ? "active-view" : ""
                }`}
                key={index}
                onClick={() => changeView(index)}
              >
                {view}
              </button>
            );
          })}
        </div>
      </div>
      <div className="section-center">
        {Object.keys(errors).length > 0 ? (
          errors
        ) : filteredProducts?.result?.length === 0 ? (
          <h1>nothing matched to your search criteria</h1>
        ) : (
          <>{viewIndex === 0 ? <GridView /> : <ListView />}</>
        )}
      </div>
    </section>
  );
};

export default memo(ProductList);
