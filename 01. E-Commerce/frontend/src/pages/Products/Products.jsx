import Copyright from "../../components/Copyright";
import FilterForm from "../../components/Products/FilterForm";
import ProductList from "../../components/Products/ProductList";

const Products = () => {
  return (
    <>
      <main>
        <FilterForm />
        <ProductList />
      </main>
      <Copyright />
    </>
  );
};

export default Products;
