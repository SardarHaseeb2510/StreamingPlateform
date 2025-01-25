import axios from "axios";
import { authToken, loggedInId } from "../GetCookieValues";

const BACKEND_URL = "http://localhost:3213";
export const addSeller = async (userData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    try {
      const response = await axios.post(`${BACKEND_URL}/adminseller/register`, userData, config);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data || 'Error adding user');
    }
  };

  export const getAllSeller = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

  
    const userResponse = await axios.get(BACKEND_URL + "/adminseller/sellers", config);
    console.log(userResponse.data.users)
    return userResponse.data.users;
  };

  export const updateSeller = async (id, userData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    try {
      const response = await axios.put(`${BACKEND_URL}/adminseller/update`, { _id: id, ...userData }, config);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data || 'Error updating user');
    }
  };

  export const deleteSeller = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    console.log(id);
  
    try {
      const response = await axios.delete(`${BACKEND_URL}/adminseller/delete/${id}`, config);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data || 'Error updating user');
    }
  };

 export const getSellerDashboard = async() => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    console.log(loggedInId);

    try {
      const response = await axios.get(`${BACKEND_URL}/sellerDashboard/${loggedInId}`, config);
      console.log(response.data);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data || 'Error seller dashboard');
    }

  }