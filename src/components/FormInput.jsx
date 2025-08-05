import styles from "./FormInput.module.css";

function FormInput({ label, name, register, errors, type = "text" }) {
  return (
    <div className={styles.Container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={label}
        className={`${styles.input} ${errors[name] ? styles.invalid : ""}`}
        {...register(name)}
      />
      {errors[name] && (
        <span className={styles.error}>{errors[name].message}</span>
      )}
    </div>
  );
}

export default FormInput;
