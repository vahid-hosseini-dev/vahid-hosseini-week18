import { useContext } from "react";
import ContactContext from "../context/ContactContext";

import styles from "./ContactItem.module.css";

function ContactItem({
  data: { id, name, lastName, email, phone, checked },
  editHandler,
}) {
  const { dispatch, setSelectedId, toggleChecked, showChecked } =
    useContext(ContactContext);

  return (
    <li className={styles.item}>
      {showChecked && (
        <input
          checked={checked}
          className={styles.checkBox}
          type="checkbox"
          onChange={() => toggleChecked(id)}
        />
      )}
      <p>
        {name} {lastName}
      </p>
      <p>
        <span>📧</span> {email}
      </p>
      <p>
        <span>📞</span> {phone}
      </p>
      <button
        onClick={() => {
          setSelectedId(id);
          dispatch({ type: "SET_MODAL", payload: "deleteSingle" });
        }}
      >
        🗑️
      </button>
      <button onClick={() => editHandler(id)}>📝</button>
    </li>
  );
}

export default ContactItem;
