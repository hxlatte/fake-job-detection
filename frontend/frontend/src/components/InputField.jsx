import React from "react";

export function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  invalid = false
}) {
  return (
    <div className={`form-group ${invalid ? "invalid" : ""}`}>
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {invalid && error && <span className="error-msg">{error}</span>}
    </div>
  );
}
