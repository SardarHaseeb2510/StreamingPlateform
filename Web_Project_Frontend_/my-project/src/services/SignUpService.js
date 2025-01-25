import axios from "axios";

const BACKEND_URL = "http://localhost:3213";

export const registerUserOrSeller = async (userOrSeller) => {
  try {
    if (userOrSeller.role === "seller") {
      const response = await axios.post(BACKEND_URL + "/adminseller/register", userOrSeller);
      console.log("Seller registered successfully:", response.data);
      return true; 
    } else {
      const user = {
        name: userOrSeller.name,
        email: userOrSeller.email,
        password: userOrSeller.password,
      };
      const response = await axios.post(BACKEND_URL + "/user/register", user);
      console.log("User registered successfully:", response.data);
      return true; 
    }
  } catch (error) {
    console.error("Error registering user or seller:", error);
    return false; 
  }
};
