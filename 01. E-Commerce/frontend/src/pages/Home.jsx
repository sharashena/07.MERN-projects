// components
import Hero from "../components/Home/Hero";
import Featured from "../components/Home/Featured";
import Copyright from "../components/Copyright";
import Loading from "../components/Loading";

// react
import { useEffect } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { getProductsThunk } from "../redux/features/products/productsThunk";

const Home = () => {
  const { loading, products } = useSelector(state => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsThunk());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <main>
        <Hero />
        {products?.result?.length > 0 && <Featured />}
      </main>
      <Copyright />
    </>
  );
};

export default Home;
