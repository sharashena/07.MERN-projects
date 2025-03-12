import { createSlice } from "@reduxjs/toolkit";
import {
  createProductThunk,
  getProductsThunk,
  getSingleProductThunk,
  getFilteredProducts,
  getCurrentUserProductsThunk,
  updateProductsThunk,
  deleteProductThunk,
} from "./productsThunk";

const getCurrencyFromStorage = () => {
  const item = localStorage.getItem("currency");

  if (item) {
    return JSON.parse(localStorage.getItem("currency"));
  } else {
    return "";
  }
};

const getRateFromStorage = () => {
  const item = localStorage.getItem("exchangeRate");

  if (item) {
    return JSON.parse(localStorage.getItem("exchangeRate"));
  } else {
    return null;
  }
};

const initialState = {
  featuredProducts: [],
  products: [],
  filteredProducts: [],
  currentUserProducts: [],
  updateProduct: {},
  singleProduct: {},
  deleteProductId: null,
  fields: {
    name: "",
    company: "",
    category: "",
    price: "",
    colors: ["#222222"],
    images: "",
    description: "",
    featured: false,
    shipping: false,
    stock: "",
  },
  filters: {
    search: "",
    category: "all",
    company: "all",
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    "sort by": "a-z",
    freeShipping: false,
  },
  loading: false,
  loadingAlert: false,
  isModal: false,
  alert: {
    type: "",
    msg: "",
    show: false,
  },
  deleteAlert: {
    msg: "",
    show: false,
  },
  currency: getCurrencyFromStorage(),
  exchangeRate: getRateFromStorage(),
  errors: {},
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    openModal: (state, action) => {
      const name = action.payload.name;
      const category = action.payload.category;
      const company = action.payload.company;
      const price = action.payload.price;
      const colors = action.payload.colors;
      const images = action.payload.images;
      const description = action.payload.description;
      const featured = action.payload.featured;
      const shipping = action.payload.shipping;
      const stock = action.payload.stock;

      state.isModal = true;
      state.fields = {
        name,
        category,
        company,
        price,
        colors,
        images,
        description,
        featured,
        shipping,
        stock,
      };
      state.updateProduct = action.payload;
    },
    previewImages: (state, action) => {
      state.fields = {
        ...state.fields,
        images: action.payload,
      };
    },
    closeModal: state => {
      state.isModal = false;
      state.fields = { ...initialState.fields };
      state.updateProduct = {};
    },
    openDeleteAlert: (state, action) => {
      state.deleteAlert = {
        msg: "delete product?",
        show: true,
      };
      state.deleteProductId = action.payload;
    },
    closeDeleteAlert: state => {
      state.deleteAlert = {
        msg: "",
        show: false,
      };
    },
    closeAlert: state => {
      state.alert = { ...initialState.alert };
    },
    changeFields: (state, action) => {
      const name = action.payload.name;
      const value = action.payload.value;
      state.fields = { ...state.fields, [name]: value };
    },
    changeFilterFields: (state, action) => {
      const name = action.payload.name;
      const value = action.payload.value;
      state.filters = { ...state.filters, [name]: value };
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearCompanyField: state => {
      state.fields.company = "";
    },
    clearCategoryField: state => {
      state.fields.category = "";
    },
    resetErrorFields: state => {
      state.errors = { ...initialState.errors };
    },
    updatePrice: (state, action) => {
      const maxPrice = action.payload.maxPrice;
      state.filters.maxPrice = maxPrice;
      state.filters.price = maxPrice;
    },
    resetFilters: (state, action) => {
      const maxPrice = action.payload.maxPrice;
      state.filters = {
        ...state.filters,
        price: maxPrice,
        maxPrice,
      };
    },
    resetFields: state => {
      state.fields = { ...initialState.fields };
    },
  },
  extraReducers: builder => {
    // create product
    builder.addCase(createProductThunk.pending, state => {
      state.loading = true;
    });

    builder.addCase(createProductThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
      state.fields = { ...initialState.fields };
    });

    builder.addCase(createProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });

    // get products
    builder.addCase(getProductsThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(getProductsThunk.fulfilled, (state, action) => {
      const featuredProducts = action.payload?.result.filter(
        product => product.featured === true
      );

      state.loading = false;
      state.products = action.payload;
      state.filteredProducts = {
        numOfProducts: featuredProducts.length,
        result: action.payload.result,
      };
      state.featuredProducts = {
        numOfProducts: featuredProducts.length,
        result: featuredProducts,
      };
    });
    builder.addCase(getProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });

    // get signle product
    builder.addCase(getSingleProductThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(getSingleProductThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.singleProduct = action.payload;
    });
    builder.addCase(getSingleProductThunk.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });

    // get filtered products
    builder.addCase(getFilteredProducts.pending, state => {
      state.loading = true;
    });
    builder.addCase(getFilteredProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.filteredProducts = action.payload;
    });
    builder.addCase(getFilteredProducts.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });

    // current user products
    builder.addCase(getCurrentUserProductsThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(getCurrentUserProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUserProducts = action.payload;
    });
    builder.addCase(getCurrentUserProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });

    // update product
    builder.addCase(updateProductsThunk.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateProductsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
    });
    builder.addCase(updateProductsThunk.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });

    // delete product
    builder.addCase(deleteProductThunk.pending, state => {
      state.loadingAlert = true;
      state.deleteAlert = {
        ...state.deleteAlert,
        show: true,
      };
    });
    builder.addCase(deleteProductThunk.fulfilled, (state, action) => {
      state.loadingAlert = false;
      state.alert = {
        type: "success",
        msg: action.payload,
        show: true,
      };
      state.deleteAlert = {
        ...state.deleteAlert,
        show: false,
      };
    });
    builder.addCase(deleteProductThunk.rejected, state => {
      state.loadingAlert = false;
      state.deleteAlert = {
        msg: action.payload,
        show: true,
      };
    });
  },
});

export default productsSlice.reducer;
export const {
  openModal,
  closeModal,
  changeFields,
  changeFilterFields,
  setErrors,
  clearCategoryField,
  clearCompanyField,
  resetErrorFields,
  closeAlert,
  updatePrice,
  resetFilters,
  resetFields,
  openDeleteAlert,
  closeDeleteAlert,
} = productsSlice.actions;
