import axios from "axios";

const BACKEND_URL = "http://localhost:3213";

export const loginUserSellerAdmin = async ({ email, password }) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/login/userSellerAdmin`, { email, password });
    const { token, id, role, isSubscribed } = response.data;

    console.log({ token, id, role,isSubscribed });

    document.cookie = `authToken=${token}; path=/; Secure`; 
    document.cookie = `userRole=${role}; path=/; Secure`;
    document.cookie = `userId=${id}; path=/; Secure`;
    document.cookie = `isSubscribed=${isSubscribed}; path=/; Secure`;

    return { token, id, role,isSubscribed };
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};