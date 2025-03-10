import { formatPrice } from "../../helpers/formatPrice";
import { getUniqueField } from "../../helpers/getUniqueField";

// react
import { memo, useEffect } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  changeFilterFields,
  updatePrice,
  resetFilters,
} from "../../redux/features/products/productsSlice";
import {
  getFilteredProducts,
  getProductsThunk,
} from "../../redux/features/products/productsThunk";

const FilterForm = () => {
  const { products, filters } = useSelector(state => state.products);
  const dispatch = useDispatch();

  const companies = getUniqueField(products.result, "company");
  const categories = getUniqueField(products.result, "category");

  const sort = ["a-z", "z-a", "price highest", "price lowest"];

  const maxPrice =
    products?.result?.length > 0 &&
    Math.max(...products?.result?.map(product => product.price));

  const handleResetFilters = () => {
    dispatch(resetFilters({ maxPrice }));
  };

  const handleChange = e => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "price") {
      value = Number(value);
    }

    if (name === "freeShipping") {
      value = e.target.checked;
    }
    dispatch(changeFilterFields({ name, value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const filterProducts = {};

    if (filters.search !== "") {
      filterProducts.search = filters.search;
    }

    if (filters.category !== "all") {
      filterProducts.category = filters.category;
    }

    if (filters.company !== "all") {
      filterProducts.company = filters.company;
    }

    if (filters.featured !== undefined) {
      filterProducts.featured = filters.featured;
    }

    if (filters.freeShipping) {
      filterProducts.shipping = true;
    }

    if (filters["sort by"] !== "a-z") {
      filterProducts.sort = filters["sort by"];
    }

    if (filters.price > 0) {
      filterProducts.price = filters.price;
    }

    if (Object.keys(filterProducts).length === 0) {
      dispatch(getProductsThunk());
    } else {
      dispatch(getFilteredProducts(filterProducts));
    }
  };

  useEffect(() => {
    dispatch(updatePrice({ maxPrice }));
  }, [dispatch, products]);

  return (
    <section className="section" onSubmit={handleSubmit}>
      <form className="section-center filter-center">
        <article className="form-control">
          <div className="input-container">
            <input
              type="text"
              name="search"
              className="filter-input"
              placeholder=""
              value={filters.search}
              onChange={handleChange}
            />
            <h5>search products</h5>
          </div>
        </article>

        <article className="form-control">
          <select
            name="company"
            className="filter-input"
            value={filters.company}
            onChange={handleChange}
          >
            {companies.map((company, index) => {
              return (
                <option value={company} key={index}>
                  {company}
                </option>
              );
            })}
          </select>
        </article>

        <article className="form-control">
          <select
            name="category"
            className="filter-input"
            value={filters.category}
            onChange={handleChange}
          >
            {categories.map((category, index) => {
              return (
                <option value={category} key={index}>
                  {category}
                </option>
              );
            })}
          </select>
        </article>

        <article className="form-control">
          <select
            name="sort by"
            className="filter-input"
            value={filters["sort by"]}
            onChange={handleChange}
          >
            {sort.map((s, index) => {
              return (
                <option value={s} key={index}>
                  {s}
                </option>
              );
            })}
          </select>
        </article>

        <article className="form-control">
          <p className="filter-price">
            {formatPrice(filters.price || 0)}
          </p>

          <input
            type="range"
            name="price"
            className="range-input"
            max={filters.maxPrice || 0}
            min={filters.minPrice}
            value={filters.price}
            onChange={handleChange}
          />
          <footer className="range-footer">
            <p>{formatPrice(filters.minPrice)}</p>
            <p>{formatPrice(filters.maxPrice || 0)}</p>
          </footer>
        </article>

        <article className="form-control">
          <label htmlFor="freeShipping">free shipping</label>
          <input
            type="checkbox"
            name="freeShipping"
            id="freeShipping"
            className="checkbox-input"
            checked={filters.freeShipping}
            onChange={handleChange}
          />
        </article>

        <button className="btn btn-block filter-btn">search</button>
        <button
          type="button"
          className="btn btn-block reset-btn filter-btn"
          onClick={handleResetFilters}
        >
          reset
        </button>
      </form>
    </section>
  );
};

export default memo(FilterForm);
