const showToast = (setToast, message, type = "success") => {
  setToast({ message, type });
  setTimeout(() => {
    setToast(null);
  }, 3000);
};

export default showToast;
