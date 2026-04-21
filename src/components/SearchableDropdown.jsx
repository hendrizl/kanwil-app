import { useEffect, useRef, useState } from "react";

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Pilih…",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedOption) setQuery(selectedOption.label);
    else setQuery("");
  }, [value, selectedOption]);

  const handleSelect = (option) => {
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="searchable-dropdown" ref={wrapperRef}>
      <div className="searchable-dropdown-input-wrapper">
        <input
          className="searchable-dropdown-input"
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => { if (!disabled) setOpen(true); }}
        />
        {query && !disabled && (
          <button
            type="button"
            className="searchable-dropdown-clear"
            onClick={handleClear}
          >
            ×
          </button>
        )}
      </div>

      {open && !disabled && (
        <div className="searchable-dropdown-panel">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`searchable-dropdown-item ${opt.value === value ? "selected" : ""}`}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            ))
          ) : (
            <div className="searchable-dropdown-empty">Tidak ditemukan</div>
          )}
        </div>
      )}
    </div>
  );
}