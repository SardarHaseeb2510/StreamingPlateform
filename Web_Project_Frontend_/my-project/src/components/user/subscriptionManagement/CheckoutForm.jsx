import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment } from '../../../services/subscription/SubscriptionManagement';
import { isSubscribed, loggedInId } from '../../../services/GetCookieValues';

function CheckoutForm({ subscription }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (subscription.price < 1) {
        alert("Amount must be at least ₹1.00");
        return;
    }

    try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error.message);
            return;
        }

        const paymentData = {
            stripeEmail: "user@example.com",
            stripeToken: paymentMethod.id,
            amount: subscription.price,
            productName:subscription.name,
            subscriptionPlanId: subscription._id,
            userId:loggedInId
        };

        const paymentResponse = await processPayment(paymentData);
        console.log(paymentResponse)
        if(paymentResponse == null)
          alert("Payment failed, Already subscribed!");
        if (paymentResponse.status === 'succeeded') {
            alert('Payment Successful!');
        } else {
            console.error('Payment failed:', paymentResponse);
        }
    } catch (error) {
        console.error('Payment processing error:', error.message);
        alert("Payment failed, Already subscribed! or Internal Server error has occurred")
    }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg transition duration-200 font-semibold"
      >
        Pay Rs {subscription.price}
      </button>
    </form>
  );
}

export default CheckoutForm;
