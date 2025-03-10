import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

// redux
import { useSelector, useDispatch } from "react-redux";

const CustomDropdown = ({
  title,
  value,
  handleChange,
  selectField,
  error,
  clearField,
}) => {
  const { loading } = useSelector(state => state.products);
  const [openId, setOpenId] = useState(null);
  const selectRef = useRef(null);

  const dispatch = useDispatch();

  const openSubmenu = id => {
    setOpenId(openId === id ? null : id);
    if (selectRef.current) {
      selectRef.current.focus();
    }
  };
  const closeDropdown = () => {
    setOpenId(null);
  };

  const clearSelectedOption = e => {
    e.stopPropagation();
    dispatch(clearField());
    setOpenId(null);
  };

  const outsideClick = e => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setOpenId(null);
    }
  };

  useEffect(() => {
    window.addEventListener("click", outsideClick);
    return () => window.removeEventListener("click", outsideClick);
  }, []);

  return (
    <div>
      {error && <h4 className="error-field">{error}</h4>}
      <article
        className={`dropdown-container ${
          openId === 1 || value ? "focused" : ""
        } ${loading ? "dropdown-disabled" : ""}`}
        onClick={() => openSubmenu(1)}
        ref={selectRef}
        tabIndex={0}
      >
        <h5 className="dropdown-title">{title}</h5>
        {value && <h4 className="selected-option">{value}</h4>}
        <div className="input-container">
          <aside
            className={`dropdown-options ${
              openId === 1 ? "show-dropdown" : ""
            }`}
          >
            {selectField.map((field, index) => {
              return (
                <div
                  className="dropdown-option"
                  key={index}
                  data-name={title}
                  data-value={field}
                  onClick={e => {
                    handleChange(e);
                    closeDropdown();
                  }}
                >
                  {field}
                </div>
              );
            })}
          </aside>
        </div>

        {value ? (
          <button
            type="button"
            className="arrow-icon"
            onMouseDown={clearSelectedOption}
          >
            <FaTimes />
          </button>
        ) : (
          <button
            type="button"
            className={`arrow-icon ${openId === 1 ? "rotate" : ""}`}
          >
            <FaChevronDown />
          </button>
        )}
      </article>
    </div>
  );
};

export default CustomDropdown;
