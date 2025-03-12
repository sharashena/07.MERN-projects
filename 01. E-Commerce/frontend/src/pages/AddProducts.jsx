import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  changeFields,
  setErrors,
  clearCategoryField,
  clearCompanyField,
  resetErrorFields,
  resetFields,
} from "../redux/features/products/productsSlice";
import { createProductThunk } from "../redux/features/products/productsThunk";

import CustomDropdown from "../components/Products/CustomDropdown";
import { FaPlus, FaTimes } from "react-icons/fa";

// components
import Alert from "../components/Products/Alert";
import Copyright from "../components/Copyright";

import { addProductsValidation } from "../validations";

const AddProducts = () => {
  const { fields, errors, loading, alert } = useSelector(
    state => state.products
  );
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const colorRef = useRef(null);
  const imagesRef = useRef(null);

  const allCompanies = ["marcos", "liddy", "ikea", "caressa"];
  const allCategories = [
    "living room",
    "kitchen",
    "bedroom",
    "dining",
    "office",
    "kids",
  ];

  const openColors = () => {
    colorRef.current.click();
  };

  const openImages = () => {
    imagesRef.current.click();
  };

  const deletePrevImage = id => {
    const newArr = images.filter(image => image.id !== id);
    setImages(newArr);
  };

  const handleChange = e => {
    const name = e.target.name || e.target.dataset.name;
    let value = e.target.dataset.value || e.target.value;

    if (name === "price" || name === "stock") {
      value = value === "" ? "" : Number(value);
    }

    if (name === "shipping" || name === "featured") {
      value = e.target.checked;
    }
    if (name === "colors") {
      value = [e.target.value];
    }

    if (name === "images") {
      const selectedFiles = e.target.files;
      const files = Array.from(selectedFiles);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileObj = {
            id: uuidv4(),
            file,
            name: file.name,
            preview: reader.result,
          };

          setImages(prevImg => [...prevImg, fileObj]);
        };
        reader.readAsDataURL(file);
      });

      e.target.value = null;
    }

    dispatch(changeFields({ name, value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = addProductsValidation(fields);

    if (Object.keys(errors).length > 0) {
      dispatch(setErrors(errors));
      const timeout = setTimeout(() => {
        dispatch(resetErrorFields());
      }, 4000);
      return () => clearTimeout(timeout);
    }

    const formData = new FormData();

    formData.append("name", fields.name);
    formData.append("company", fields.company);
    formData.append("category", fields.category);
    formData.append("price", fields.price);
    formData.append("colors", JSON.stringify(fields.colors));
    formData.append("description", fields.description);
    formData.append("featured", fields.featured);
    formData.append("shipping", fields.shipping);
    formData.append("stock", fields.stock);

    if (images && images.length > 0) {
      images.forEach(({ file }) => {
        formData.append("images", file);
      });
    }

    const result = await dispatch(createProductThunk(formData));

    if (createProductThunk.fulfilled.match(result)) {
      setImages([]);
    }
  };

  useEffect(() => {
    dispatch(resetFields());
  }, [window.location.pathname]);

  return (
    <>
      {alert.show && <Alert />}
      <main className="section">
        <form
          className="form-center"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <article className="form-control">
            {errors?.name && <h4 className="error-field">{errors.name}</h4>}
            <div className="input-container">
              <input
                type="text"
                name="name"
                className="filter-input"
                placeholder=""
                value={fields.name}
                onChange={handleChange}
                disabled={loading}
              />
              <h5 className="filter-form-title">search products</h5>
            </div>
          </article>

          <CustomDropdown
            title={"company"}
            value={fields.company}
            handleChange={handleChange}
            selectField={allCompanies}
            error={errors?.company}
            clearField={clearCompanyField}
          />
          <CustomDropdown
            title={"category"}
            value={fields.category}
            handleChange={handleChange}
            selectField={allCategories}
            error={errors?.category}
            clearField={clearCategoryField}
          />
          <article className="form-control">
            {errors?.price && <h4 className="error-field">{errors.price}</h4>}
            <div className="input-container">
              <input
                type="number"
                name="price"
                className="filter-input"
                placeholder=""
                min={1}
                value={fields.price}
                onChange={handleChange}
                disabled={loading}
              />
              <h5 className="filter-form-title">price</h5>
            </div>
          </article>

          <article className="form-control">
            <h4>colors</h4>
            <input
              type="color"
              name="colors"
              ref={colorRef}
              hidden
              value={fields.colors}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="color-input-container">
              <button
                type="button"
                className="color-input"
                style={{ background: fields.colors }}
                onClick={openColors}
              />
            </div>
          </article>

          <article className="preview-images-container">
            <input
              type="file"
              hidden
              ref={imagesRef}
              name="images"
              onChange={handleChange}
              multiple
              disabled={loading}
            />
            {images.map(({ id, preview, name }) => {
              return (
                <div className="preview-images" key={id}>
                  <img
                    src={preview}
                    alt={name}
                    title={name}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="delete-preview-image"
                    onClick={() => deletePrevImage(id)}
                    disabled={loading}
                  >
                    <FaTimes />
                  </button>
                </div>
              );
            })}

            <div className="choose-image" onClick={openImages}>
              <button type="button" className="add-image-btn">
                <FaPlus />
              </button>
            </div>
          </article>

          <article className="form-control">
            {errors?.description && (
              <h4 className="error-field">{errors.description}</h4>
            )}
            <textarea
              name="description"
              placeholder="Describe product with few words..."
              className="add-product-description"
              value={fields.description}
              onChange={handleChange}
              disabled={loading}
            />
          </article>

          <article className="form-control">
            <label htmlFor="featured">featured</label>
            <input
              type="checkbox"
              name="featured"
              id="featured"
              className="checkbox-input"
              checked={fields.featured}
              onChange={handleChange}
              disabled={loading}
            />
          </article>

          <article className="form-control">
            <label htmlFor="shipping">free shipping</label>
            <input
              type="checkbox"
              name="shipping"
              id="shipping"
              className="checkbox-input"
              checked={fields.shipping}
              onChange={handleChange}
              disabled={loading}
            />
          </article>
          <article className="form-control">
            {errors?.stock && <h4 className="error-field">{errors.stock}</h4>}
            <div className="input-container stock-control">
              <input
                type="number"
                name="stock"
                placeholder=""
                className="filter-input stock-input"
                value={fields.stock}
                onChange={handleChange}
                min={1}
                disabled={loading}
              />
              <h5 className="filter-form-title">stock</h5>
            </div>
          </article>
          <button className="btn btn-block filter-btn" disabled={loading}>
            {loading ? <div className="spinner" /> : "add products"}
          </button>
        </form>
      </main>
      <Copyright />
    </>
  );
};

export default AddProducts;
