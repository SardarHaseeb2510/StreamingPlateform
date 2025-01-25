import React, { useState } from 'react';
import axios from 'axios';
import { loggedInId } from '../../../services/GetCookieValues';

const CardDetailsForm = () => {
    const [formData, setFormData] = useState({
        sellerId: loggedInId,
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3213" + '/seller/card-details', formData);
            setResponseMessage(response.data.message);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred.');
            setResponseMessage('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-900 to-black p-8">
            <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h2 className="text-2xl font-bold text-violet-200 text-center">Enter Seller Card Details</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    {responseMessage && <div className="text-green-500">{responseMessage}</div>}

                    <div>
                        <label htmlFor="cardHolderName" className="text-gray-200">Card Holder Name</label>
                        <input
                            type="text"
                            id="cardHolderName"
                            name="cardHolderName"
                            value={formData.cardHolderName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 bg-violet-900 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cardNumber" className="text-gray-200">Card Number</label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 bg-violet-900 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="expiryDate" className="text-gray-200">Expiry Date (MM/YY)</label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 bg-violet-900 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cvv" className="text-gray-200">CVV</label>
                        <input
                            type="password"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 bg-violet-900 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-700 hover:bg-violet-600 text-white py-2 rounded-lg mt-4 transition duration-200"
                    >
                        Submit
                    </button>
                </form>
                {responseMessage && (
                    <p className="mt-4 text-center text-green-600 font-medium">
                        {responseMessage}
                    </p>
                )}
                {errorMessage && (
                    <p className="mt-4 text-center text-red-600 font-medium">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CardDetailsForm;
