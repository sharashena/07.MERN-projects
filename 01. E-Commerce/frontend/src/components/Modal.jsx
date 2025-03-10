import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// redux
import { useSelector, useDispatch } from "react-redux";
import {
  changeFields,
  clearCategoryField,
  clearCompanyField,
  closeModal,
  resetFields,
  resetErrorFields,
  setErrors,
} from "../redux/features/products/productsSlice";
import { updateProductsThunk } from "../redux/features/products/productsThunk";

import CustomDropdown from "./Products/CustomDropdown";
import { FaPlus, FaTimes } from "react-icons/fa";
import { addProductsValidation } from "../validations";

const Modal = () => {
  const { isModal, fields, updateProduct, loading, errors } = useSelector(
    state => state.products
  );
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const modalRef = useRef(null);
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

  const deleteExistingImage = id => {
    const newArr = existingImages.filter(image => image.id !== id);
    setExistingImages(newArr);
  };

  const handleChange = e => {
    const name = e.target.name || e.target.dataset.name;
    let value = e.target.dataset.value || e.target.value;
    const files = e.target.files;

    if (name === "price" || name === "stock") {
      value = value === "" ? "" : Number(value);
    }

    if (name === "shipping" || name === "featured") {
      value = e.target.checked;
    }
    if (name === "colors") {
      value = [e.target.value];
    }

    if (files && files.length > 0) {
      const filesArray = Array.from(files);

      filesArray.map(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileObj = {
            id: uuidv4(),
            file,
            name: file.name,
            image: reader.result,
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
    formData.append("colors", fields.colors);
    formData.append("description", fields.description);
    formData.append("featured", fields.featured);
    formData.append("shipping", fields.shipping);
    formData.append("stock", fields.stock);

    formData.append("existingImages", JSON.stringify(existingImages));
    images.forEach(({ file }) => formData.append("images", file));

    const result = await dispatch(
      updateProductsThunk({ id: updateProduct?.id, formData })
    );

    if (updateProductsThunk.fulfilled.match(result)) {
      dispatch(resetFields());
      setImages([]);
    }
  };

  const outsideClick = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      dispatch(closeModal());
      setExistingImages([]);
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setExistingImages([]);
  };

  useEffect(() => {
    if (fields && fields.images.length > 0) {
      setExistingImages(fields.images);
    } else {
      setExistingImages([]);
    }
  }, [fields.images]);

  useEffect(() => {
    if (isModal) {
      window.addEventListener("click", outsideClick);
    } else {
      window.removeEventListener("click", outsideClick);
    }

    return () => window.removeEventListener("click", outsideClick);
  }, [isModal]);

  return (
    <div className={`modal-overlay ${isModal ? "show-modal" : ""}`}>
      <form
        className="form-modal form-center"
        onSubmit={handleSubmit}
        ref={modalRef}
      >
        <button type="button" className="close-btn" onClick={handleCloseModal}>
          <FaTimes />
        </button>
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
            <h5 className="filter-form-title">name</h5>
          </div>
        </article>

        <CustomDropdown
          title={"company"}
          value={fields.company}
          handleChange={handleChange}
          selectField={allCompanies}
          clearField={clearCompanyField}
          error={errors?.company}
        />
        <CustomDropdown
          title={"category"}
          value={fields.category}
          handleChange={handleChange}
          selectField={allCategories}
          clearField={clearCategoryField}
          error={errors?.category}
        />
        <article className="form-control">
          {errors?.price && <h4 className="error-field">{errors.price}</h4>}
          <div className="input-container">
            <input
              type="number"
              name="price"
              className="filter-input"
              placeholder=""
              value={fields.price}
              min={1}
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
          {Array.isArray(existingImages) &&
            existingImages.map(({ id, src, name }, index) => {
              return (
                <div className="preview-images" key={index}>
                  <img
                    src={src}
                    alt={name}
                    title={name}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="delete-preview-image"
                    onClick={e => {
                      e.stopPropagation();
                      deleteExistingImage(id);
                    }}
                    disabled={loading}
                  >
                    <FaTimes />
                  </button>
                </div>
              );
            })}

          {images.map(({ id, image, name }) => {
            return (
              <div className="preview-images" key={id}>
                <img
                  src={image}
                  alt={name}
                  title={name}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="delete-preview-image"
                  onClick={e => {
                    e.stopPropagation();
                    deletePrevImage(id);
                  }}
                  disabled={loading}
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}

          <input
            type="file"
            hidden
            ref={imagesRef}
            name="image"
            onChange={handleChange}
            multiple
            disabled={loading}
          />
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
        <article className="form-control stock-control">
          {errors?.stock && <h4 className="error-field">{errors.stock}</h4>}
          <div className="input-container">
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
          {loading ? <div className="spinner" /> : "update product"}
        </button>
      </form>
    </div>
  );
};
export default Modal;
