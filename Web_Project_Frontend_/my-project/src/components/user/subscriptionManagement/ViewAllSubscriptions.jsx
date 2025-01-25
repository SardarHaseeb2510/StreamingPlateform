import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubscription } from '../../../services/subscription/SubscriptionManagement';

function UserSubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    const getAllSubscriptions = async () => {
      const fetchedSubscription = await getAllSubscription();
      setSubscriptions(fetchedSubscription);
    };

    getAllSubscriptions();
  }, []);

  const navigateToCheckout = (subscription) => {
    navigator('/user/addSubscription', { state: { subscription } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-black text-white p-4 md:p-8">
      <button 
        onClick={() => navigator('/user/subscriptionHistory')} 
        className="bg-violet-700 hover:bg-violet-600 text-white py-2 px-4 rounded-lg mb-4 transition duration-200"
      >
        See History
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-violet-800 to-black text-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Duration</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription._id} className="border-b border-gray-300">
                <td className="border border-gray-300 p-2 text-center">{subscription.name}</td>
                <td className="border border-gray-300 p-2 text-center">{subscription.price}</td>
                <td className="border border-gray-300 p-2 text-center">{subscription.duration}</td>
                <td className="border border-gray-300 p-2 text-center">{subscription.description}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => navigateToCheckout(subscription)}
                    className="bg-violet-700 hover:bg-violet-600 text-white p-2 rounded-lg transition duration-200"
                  >
                    Subscribe
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

export default UserSubscriptionManagement;
