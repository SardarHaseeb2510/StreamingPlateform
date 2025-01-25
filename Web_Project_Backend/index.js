const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cors = require('cors');

const { loginUserSellerAdmin ,googleAuth } = require('./utility/util'); 
const { uploadMovieMiddleware,
    uploadCoverPhotoMiddleware, uploadMovie,uploadMovieCoverPhoto, streamMovie, getMovies, getMoviesByFilter, getTopMoviesByGenre, getTopMoviesOfTheMonth, getMostPopularMovies, getMovieById, updateMovie, deleteMovie, getTrendingGenres, getApprovedMoviesForSeller, getNonApprovedMoviesForSeller, 
    getAllForSeller,
    getMoviesForAdmin,
    getTopTenMovies,
    getMovieByName,
    getActionMovies,
    getComedyMovies} = require('./modules/movies/MoviesController');
const { registerAdminSeller,updateProfileAdminSeller, getProfileAdminSeller, getAllAdminSellers, getAllAdmins, getAllSellers, deleteAdminSeller, adminDashboard, sellerDashboard}=require('./modules/adminSellerUser/AdminSellerController');
const {registerUser, getProfile,getAllUsers,updateProfile,deleteUser,getUserWishlist,getMoviesBasedOnUserActivities, getSubscriptionForUser}=require('./modules/adminSellerUser/UserController');
const {createPerson,getPersons,getPersonById,updatePerson,deletePerson}=require('./modules/persons/PersonController');
const {getReviewPieGraph,getReviewBarGraph,createReview, updateReview, getAllReviewsForMovie,getTopRatedReviewsForMovie,getMostDiscussedReviewsForMovie,deleteReviewByAdmin}=require('./modules/reviews/ReviewController')
const { getMoviesBasedOnGenreUserRatingAndUserActivity, getSimilarTitlesMovies, getTrendingMovies, getTopRatedMovies } = require('./modules/recomendation/RecomendationController');
const {getAllWatchHistory,addToWatchHistory,deleteFromWatchHistory} = require('./modules/watchHistory/WatchHistoryController');
const{ payment,addOrUpdateSubscriptionForUser,getAllSubscriptionsForUser}=require('./modules/subscriptionManagement/CustomerSubscriptionController');
const{ addSubscriptionPlan, getAllSubscriptionPlans,updateSubscriptionPlan,deleteSubscriptionPlan}=require('./modules/subscriptionManagement/SubscriptionPlanController');
const { addNotification, deleteNotification, getNotification, getAllNotifications } = require('./modules/notification/NotificationController');
const { addSellerCardDetails } = require('./modules/adminSellerUser/SellerCardController');

let app = express();



app.use(cors());
app.use(express.json());



////////////////////////////////////////////only isApproved wali movies
//Routes where authentication is not needed
app.post('/adminseller/register', registerAdminSeller);
app.post('/user/register', registerUser);
app.post('/login/userSellerAdmin', loginUserSellerAdmin);
app.post('/auth/google', googleAuth);

//AdminSeller
app.get('/adminDashboard', adminDashboard);
app.get('/sellerDashboard/:id', sellerDashboard);
app.put('/adminseller/update', updateProfileAdminSeller);
app.get('/adminseller/profile', getProfileAdminSeller);
app.get('/adminseller/all' , getAllAdminSellers);
app.get('/adminseller/admins' , getAllAdmins);
app.get('/adminseller/sellers' , getAllSellers);
app.delete('/adminseller/delete/:id' , deleteAdminSeller);
app.post('/seller/card-details', addSellerCardDetails);

//User
app.get('/user/profile/:id' , getProfile);
app.get('/user/all' , getAllUsers);   
app.put('/user/update' , updateProfile);
app.delete('/user/delete/:userId' , deleteUser);
app.get('/user/wishlist/:userId' , getUserWishlist);
app.get('/user/activities/:userId' , getMoviesBasedOnUserActivities);
app.get('/getSubscriptionForUser/:userId' ,getSubscriptionForUser );

//Person
app.post('/persons', createPerson); // Create a new person
app.get('/persons', getPersons); // Get all persons with pagination
app.get('/persons/:id', getPersonById); // Get a specific person by ID
app.put('/persons/:id', updatePerson); // Update a specific person by ID
app.delete('/persons/:id', deletePerson);

//Movie
app.get('/movie/getByName/:movieName',getMovieByName);
app.get('/movies/getAll', getMoviesForAdmin);
app.get('/movies/getAllAction', getActionMovies );
app.get('/movies/getAllComedy' , getComedyMovies );
app.get('/movies/:id' , getMovieById);
app.post('/movies/upload' , uploadMovieMiddleware, uploadMovie);
app.post('/movies/:id/upload-cover', uploadCoverPhotoMiddleware,uploadMovieCoverPhoto);
app.put('/movies/:id' ,  updateMovie);

// app.get('/movies/stream/:id' , streamMovie);
app.get('/movies' , getTopTenMovies);
app.get('/movies/filter' , getMoviesByFilter);
app.get('/movies/top/genre' , getTopMoviesByGenre);
app.get('/movies/top/month' , getTopMoviesOfTheMonth);
app.get('/movies/popular' , getMostPopularMovies);
app.delete('/movies/:id' ,  deleteMovie);
app.get('/movies/trending/genres' , getTrendingGenres);
app.get('/movies/getAllForSeller/:id'  , getAllForSeller);
app.get('/movies/getApprovedMoviesForSeller/:sellerId' ,  getApprovedMoviesForSeller);
app.get('/movies/getNonApprovedMoviesForSeller/:sellerId' , getNonApprovedMoviesForSeller);

//Review Routes   
app.post('/reviews' , createReview); // Create a review
app.put('/reviews/:reviewId' , updateReview); // Update a review
app.get('/reviews/movie/:movie' , getAllReviewsForMovie); // Get all reviews for a specific movie
app.get('/reviews/top/movie/:movie' , getTopRatedReviewsForMovie); // Get top-rated reviews for a movie
app.get('/reviews/most-discussed' , getMostDiscussedReviewsForMovie); // Get the most discussed movie reviews
app.get('/reviews/pie-graph/:movieId' , getReviewPieGraph); // Get pie chart of reviews for a movie
app.get('/reviews/bar-graph/:movieId' , getReviewBarGraph); // Get bar chart of reviews for a movie
app.delete('/reviews/:reviewId' , deleteReviewByAdmin); // Delete a review by admin

//Recomendation
app.get('/movies/genre-user-rating-activity/:userId' , getMoviesBasedOnGenreUserRatingAndUserActivity);// Route to get movies similar to a given movie (by genre, director, etc.)
app.get('/movies/similar/:movieId' ,getSimilarTitlesMovies);// Route to get trending movies based on user ratings
app.get('/movies/trending/:userId' , getTrendingMovies);// Route to get top-rated movies based on user ratings and popularity
app.post('/movies/top-rated' , getTopRatedMovies);

//WatchHistory
app.get('/watch-history/:userId' , getAllWatchHistory);// Add a movie to watch history
app.post('/watch-history' ,addToWatchHistory);// Delete a movie from watch history
app.delete('/watch-history/:userId/:movieId' ,deleteFromWatchHistory);

// Customer Subscription Routes
app.post('/subscriptions/process-payment' , payment);
app.get('/subscriptions/:userId' ,getAllSubscriptionsForUser);

// Subscription Plan Routes
app.post('/plans' , addSubscriptionPlan);
app.get('/plans' , getAllSubscriptionPlans);
app.put('/plans/:id' ,updateSubscriptionPlan);
app.delete('/plans/:id' , deleteSubscriptionPlan);

//Notification
app.get('/notifications/:userId' , getAllNotifications);// Get a Specific Notification for a User
app.get('/notifications/:userId/:notificationId' ,getNotification);// Add a Notification (can be used for manual testing)
app.post('/notifications/add' , addNotification);// Delete a Notification
app.delete('/notifications/:id' , deleteNotification);



mongoose.connect("mongodb+srv://i222524:ahsan1011@weblab11.x7sop.mongodb.net/webProject", {})
    .then(() => console.log("Connection built"))
    .catch((e) => console.log("Connection failed"));

app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});

module.exports = app;

