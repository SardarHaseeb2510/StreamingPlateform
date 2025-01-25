import axios from "axios";
import { authToken } from "../GetCookieValues";

const BACKEND_URL = "http://localhost:3213";

export const processPayment = async (paymentData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/subscriptions/process-payment`, paymentData, config);
    
    console.log(response)
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data || "Error processing payment");
  }
};


export const addSubscription = async (userData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    try {
      const response = await axios.post(`${BACKEND_URL}/plans`, userData, config);
      return response.data; // Returns the newly created user object
    } catch (error) {
      throw new Error(error.response?.data || 'Error adding Subscription');
    }
  };
  export const getAllSubscription = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  
    const userResponse = await axios.get(BACKEND_URL + "/plans", config);
    console.log(userResponse.data.plans)
    return userResponse.data.plans;
  };



  export const deleteSubscription = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        
      },
     
    };

    console.log(id);
  
    try {
      const response = await axios.delete(`${BACKEND_URL}/plans/${id}`, config);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data || 'Error Deleting Subscription');
    }
  };


  export const updateSubscription = async (id, data) => {
    
    console.log(id)
    const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

    const response = await axios.put(`${BACKEND_URL}/plans/${id}`, data, config);
    return response.data;
};

export const getAllSubscriptionForUsers = async (id) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

const response = await axios.get(`${BACKEND_URL}/subscriptions/${id}`, config);
console.log(response.data)
return response.data;
}