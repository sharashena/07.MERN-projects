import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";

// redux
import { Provider } from "react-redux";
import { store } from "./redux/store.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
