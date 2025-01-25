const { AdminSeller } = require("./AdminSellerUser");
const SellerCard = require("./SellerCard");


const addSellerCardDetails = async (req, res) => {
    try {
        const { sellerId, cardHolderName, cardNumber, expiryDate, cvv } = req.body;

        const seller = await AdminSeller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }
        // Store card details
        const newCard = new SellerCard({
            sellerId,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
        });

        await newCard.save();
        res.status(201).json({ message: "Card details saved successfully", card: newCard });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const cron = require('node-cron');
const stripe = require('stripe')('sk_test_51QOpTACKRhyXOJRYidGi3bZ0jSl07bTuXDpStasWUa2MLfVFD7CCA1CvBN0fcezphEvZyanbc4vnRx0HiKIJquKq00ZMwRSQf8');

const processMonthlyPayments = async () => {
    try {
        const sellers = await AdminSeller.find();

        for (const seller of sellers) {
            if (seller.payOnViews > 0) {
                const card = await SellerCard.findOne({ sellerId: seller._id });
                if (!card) {
                    console.error(`No card found for seller ${seller.name}`);
                    continue;
                }

                // Process payment using Stripe
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: seller.payOnViews / 10, // Stripe processes amounts in smallest currency units
                    currency: 'INR',
                    payment_method_types: ['card'],
                    receipt_email: seller.email,
                    description: `Monthly payout for ${seller.name}`,
                });

                console.log(`Payment of ₹${seller.payOnViews} processed for seller ${seller.name}`);
                
                // Reset payOnViews and update totalPaid
                seller.totalPaid += seller.payOnViews / 10;
                seller.payOnViews = 0;
                await seller.save();
            }
        }
    } catch (error) {
        console.error("Error processing monthly payments:", error.message);
    }
};

// Schedule the job for the last day of each month at midnight
cron.schedule('0 0 1 * *', processMonthlyPayments);

module.exports = {
    addSellerCardDetails,
};
