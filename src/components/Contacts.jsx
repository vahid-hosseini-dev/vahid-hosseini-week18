import { useContext, useEffect } from "react";
import { v4 } from "uuid";

import ContactContext from "../context/ContactContext";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import contactSchema from "../validation/contactSchema";

import FormInput from "./FormInput";
import ContactsList from "./ContactsList";
import Search from "./Search";
import Modal from "./Modal";
import Toast from "../utils/Toast";
import showToast from "../utils/showToast";
import inputs from "../constants/inputs";

import { getContacts, addContact, updateContact } from "../services/api";

import styles from "./Contacts.module.css";

function Contacts() {
  const {
    dispatch,
    contacts,
    toast,
    search,
    setToast,
    edit,
    ShowCheckedHandler,
    showChecked,
  } = useContext(ContactContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!edit) {
      reset({
        name: "",
        lastName: "",
        email: "",
        phone: "",
      });
    }
  }, [edit, reset]);

  const editHandler = (id) => {
    const ContactEdited = contacts.find((contact) => contact.id === id);
    if (!ContactEdited) return;
    dispatch({ type: "SET_CONTACT", payload: ContactEdited });
    dispatch({ type: "EDIT", payload: id });
    reset(ContactEdited);
  };

  useEffect(() => {
    getContacts()
      .then((res) => {
        dispatch({ type: "SET_CONTACTS", payload: res.data });
      })
      .catch((err) => {
        console.error("Error fetching contacts:", err);
      });
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const searchItem = search.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchItem) ||
      contact.lastName?.toLowerCase().includes(searchItem) ||
      contact.email?.toLowerCase().includes(searchItem)
    );
  });

  const addHandler = handleSubmit((data) => {
    const newContact = { ...data, id: v4(), checked: false };

    addContact(newContact).then((res) => {
      dispatch({
        type: "SET_CONTACTS",
        payload: [...contacts, res.data],
      });
      dispatch({ type: "CLEAR_CONTACT" });
      reset();
    });
  });

  const updateHandler = handleSubmit((data) => {
    const updatedContact = { ...data, id: edit };
    updateContact(edit, updatedContact)
      .then(() => getContacts())
      .then((res) => {
        dispatch({ type: "SET_CONTACTS", payload: res.data });
        dispatch({ type: "CLEAR_CONTACT" });
        dispatch({ type: "EDIT", payload: null });
        reset();
        showToast(setToast, "Contact updated successfully!", "success");
      })
      .catch(() => {
        showToast(
          setToast,
          "Failed to update contact. Please try again.",
          "error"
        );
      });
  });

  return (
    <>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={addHandler}>
          {inputs.map((input) => (
            <FormInput
              key={input.name}
              type={input.type}
              label={input.placeholder}
              name={input.name}
              register={register}
              errors={errors}
            />
          ))}

          {edit ? (
            <>
              <button
                type="button"
                className={styles.updateContact}
                onClick={() => {
                  dispatch({ type: "SET_MODAL", payload: "confirmUpdate" });
                }}
              >
                Update Contact
              </button>
              <button
                type="button"
                className={styles.cancelUpdateContact}
                onClick={() => {
                  dispatch({ type: "EDIT", payload: null });
                  dispatch({ type: "CLEAR_CONTACT" });
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className={styles.addContact}>Add Contact</button>
          )}
        </form>

        <div className={styles.editBox}>
          <button className={styles.selectBtn} onClick={ShowCheckedHandler}>
            Select Items
          </button>
          <button
            className={styles.deleteBtn}
            disabled={
              !showChecked || !contacts.some((contact) => contact.checked)
            }
            onClick={() =>
              dispatch({ type: "SET_MODAL", payload: "deleteSelected" })
            }
          >
            Delete Items
          </button>
          <Search />
        </div>

        <ContactsList contacts={filteredContacts} editHandler={editHandler} />

        <Modal reset={reset} updateHandler={updateHandler} />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default Contacts;
