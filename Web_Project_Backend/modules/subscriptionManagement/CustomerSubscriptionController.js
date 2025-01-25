const { User } = require('../adminSellerUser/AdminSellerUser');
const CustomerSubscription = require('./CustomerSubscription');
const SubscriptionPlan = require('./SubscriptionPlan');
const stripe = require('stripe')('sk_test_51QOpTACKRhyXOJRYidGi3bZ0jSl07bTuXDpStasWUa2MLfVFD7CCA1CvBN0fcezphEvZyanbc4vnRx0HiKIJquKq00ZMwRSQf8'); // Replace with your actual Stripe secret key
const cron = require('node-cron');

const payment = async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findById(userId);
        console.log(user.isSubscribed);

        if (user.isSubscribed === true) {
            return res.status(400).send("User is already subscribed.");
        }

        console.log("HELLO");

        if (req.body.amount < 1) {
            return res.status(400).send({ error: "Amount must be at least ₹1.00" });
        }

        // Create a customer
        const customer = await stripe.customers.create({
            email: req.body.stripeEmail,
            name: 'Sandeep Sharma',
            address: {
                line1: '115, Vikas Nagar',
                postal_code: '281001',
                city: 'Mathura',
                state: 'Uttar Pradesh',
                country: 'India',
            },
        });

        console.log("Customer created:", customer.id);

        // Attach payment method to the customer
        await stripe.paymentMethods.attach(req.body.stripeToken, {
            customer: customer.id,
        });

        console.log("Payment method attached");

        // Set the default payment method for the customer
        await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: req.body.stripeToken },
        });

        console.log("Default payment method updated");

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'INR',
            customer: customer.id,
            payment_method: req.body.stripeToken,
            confirm: true,
            return_url: 'http://localhost:5173/user/subscription',
        });

        console.log("PaymentIntent created:", paymentIntent);

        // Update subscription status
        await addOrUpdateSubscriptionForUser(req.body.userId, req.body.subscriptionPlanId, paymentIntent.id);

        return res.send(paymentIntent);
    } catch (error) {
        console.error("Payment error:", error.message);
        return res.status(500).send({ error: error.message });
    }
};






// Add or Update Subscription for a User
const addOrUpdateSubscriptionForUser = async (userId, planId, paymentId) => {
    try {
       

        const plan = await SubscriptionPlan.findById(planId);
        if (!plan) throw new Error('Invalid subscription plan');

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration);

        let subscription = new CustomerSubscription({
                userId,
                planId,
                startDate,
                endDate,
                paymentId,
                status: 'Active',
            });

        const user = await User.findById(userId);
        user.isSubscribed = true;

        const updatedUser = await user.save();

        console.log(updatedUser)
        
        await subscription.save();
        console.log('Subscription updated/created successfully!');
    } catch (error) {
        console.error('Error updating/creating subscription:', error.message);
        throw new Error(error.message);
    }
};

// Get all subscriptions for a user
const getAllSubscriptionsForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const subscriptions = await CustomerSubscription.find({ userId }).populate('planId');

        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const unSubscribeForUser = async (req, res) => {
//     const userId = req.body.userId;
//     const id = req.body.id;
//     const subscriptions = await CustomerSubscription.find({ _id:id, userId });
// }

const checkSubscriptions = async () => {
    try {
        console.log("Running daily subscription check...");

        const now = new Date();

        // Find subscriptions that are active and have expired
        const expiredSubscriptions = await CustomerSubscription.find({
            status: 'Active',
            endDate: { $lt: now },
        });

        // Iterate over expired subscriptions
        for (const subscription of expiredSubscriptions) {
            // Update the subscription's status to 'Expired'
            subscription.status = 'Expired';
            await subscription.save();

            // Find the associated user and update `isSubscribed` to false
            const user = await User.findById(subscription.userId);
            if (user) {
                user.isSubscribed = false;
                await user.save();
                console.log(`Updated user ${user._id}'s subscription status.`);
            }
        }

        console.log("Daily subscription check completed.");
    } catch (error) {
        console.error("Error during subscription check:", error.message);
    }
};

cron.schedule('0 0 * * *', () => {
    checkSubscriptions();
});

module.exports = {
    addOrUpdateSubscriptionForUser,
    getAllSubscriptionsForUser,
    payment
};
