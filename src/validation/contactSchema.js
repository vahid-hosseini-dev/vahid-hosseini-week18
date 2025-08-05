import * as yup from "yup";

const contactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d+$/, "Phone must be digits only")
    .length(11, "Phone number must be exactly 11 digits")
    .required("Phone is required"),
});

export default contactSchema;
