import React, { useState, useEffect } from 'react';
import { deleteSubscription, getAllSubscription } from '../../../services/subscription/SubscriptionManagement';
import { useNavigate } from 'react-router-dom';

function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    const getAllSubscriptions = async () => {
      const fetchedSubscription = await getAllSubscription(); 
      setSubscriptions(fetchedSubscription); 
    };

    getAllSubscriptions();
  }, []);

  const addSubscriptions = () => {
    navigator('/subscription/add');
  };

  const updateSubscriptions = (id) => {
    navigator('/subscription/update', { state: { id } });
  };

  const deleteSubscriptionAdmin = async (id) => {
    await deleteSubscription(id);
    const fetchedSubscription = await getAllSubscription(); 
    setSubscriptions(fetchedSubscription); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-black text-white p-8">
      <button 
        onClick={addSubscriptions}
        className="bg-violet-700 hover:bg-violet-600 text-white p-2 rounded-lg transition duration-200 mb-4"
      >
        Add Subscription
      </button>
    
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-violet-800 to-black text-gray-100">
              <th className="border border-gray-300 p-2 bg-black">Name</th>
              <th className="border border-gray-300 p-2 bg-black">Price</th>
              <th className="border border-gray-300 p-2 bg-black">Duration</th>
              <th className="border border-gray-300 p-2 bg-black">Description</th>
              <th className="border border-gray-300 p-2 bg-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription._id} className="border-b border-gray-300">
                <td className="border border-gray-300 p-2 text-center">{subscription.name}</td>
                <td className="border border-gray-300 p-2 text-center">{subscription.price}</td>
                <td className="border border-gray-300 p-2 text-center">{subscription.duration}</td>
                <td className="border border-gray-300 p-2 text-center">{subscription.description}</td>

                <td className="border border-gray-300 p-2 flex flex-wrap justify-evenly gap-2">
                  <button 
                    onClick={() => updateSubscriptions(subscription._id)}
                    className="bg-violet-700 hover:bg-violet-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => deleteSubscriptionAdmin(subscription._id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubscriptionManagement;
