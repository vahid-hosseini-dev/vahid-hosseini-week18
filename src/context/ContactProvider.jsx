import { useState, useReducer } from "react";
import ContactContext from "./ContactContext";
import { initialState, contactReducer } from "./contactReducer";
import { deleteContact, getContacts } from "../services/api";
import showToast from "../utils/showToast";

function ContactProvider({ children }) {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  const [selectedId, setSelectedId] = useState(null);
  const [showChecked, setShowChecked] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const toggleChecked = (id) => {
    const updatedContacts = state.contacts.map((contact) =>
      contact.id === id ? { ...contact, checked: !contact.checked } : contact
    );
    dispatch({ type: "SET_CONTACTS", payload: updatedContacts });
  };

  const ShowCheckedHandler = () => {
    setShowChecked(!showChecked);
  };

  const deleteHandler = (id) => {
    deleteContact(id).then(() => {
      getContacts().then((res) => {
        dispatch({ type: "SET_CONTACTS", payload: res.data });
        dispatch({ type: "SET_MODAL", payload: null });
      });
    });

    showToast(setToast, "Contact deleted!", "error");
  };

  const deleteSelectedHandler = () => {
    const checkedContacts = state.contacts.filter((c) => c.checked);
    Promise.all(checkedContacts.map((contact) => deleteContact(contact.id)))
      .then(() => getContacts())
      .then((res) => {
        dispatch({ type: "SET_CONTACTS", payload: res.data });
        showToast(setToast, "Selected contacts deleted!", "error");
      });
  };

  const searchHandler = (event) => {
    const value = event.target.value;
    setSearch(value);
  };

  const value = {
    ...state,
    dispatch,

    selectedId,
    setSelectedId,

    search,
    setSearch,
    searchHandler,
    showChecked,
    setShowChecked,
    ShowCheckedHandler,

    toggleChecked,
    deleteHandler,
    deleteSelectedHandler,

    errors,
    setErrors,
    toast,
    setToast,
    showToast,
  };

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export default ContactProvider;
