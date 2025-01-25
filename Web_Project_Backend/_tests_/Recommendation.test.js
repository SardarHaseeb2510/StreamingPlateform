const request = require('supertest');
const Movie = require("../modules/movies/Movie");
const mongoose = require("mongoose");
const Review = require("../modules/reviews/Reviews");
const { getMoviesBasedOnUserActivities } = require("../modules/adminSellerUser/UserController");
const { User } = require("../modules/adminSellerUser/AdminSellerUser");
const app = require("../index")

const mockMovie1Data = {
    title: "Red Notice",
    genre: ["Action", "Adventure", "Comedy"],
    director: new mongoose.Types.ObjectId(),
    cast: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    releaseDate: new Date(),
    runtime: 120,
    popularity: 80,
    views: 0,
    overview: "An action-packed adventure movie.",
    averageRating: 0, // Initial average rating
    movieCoverPhoto: null, 
    photo: null,
    ageRating: "13+",
    parentalGuidance: "Parental guidance suggested.",
    countryOfOrigin: "USA",
    Language: "English",
    keywords: ["action", "adventure", "thrill"],
    isApproved: true,
    sellerId: new mongoose.Types.ObjectId(),
  };

const mockMovie2Data = {
    title: "Inception",
    genre: ["Action", "Adventure", "Science-Fiction"],
    director: new mongoose.Types.ObjectId(),
    cast: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    releaseDate: new Date(),
    runtime: 140,
    popularity: 70,
    views: 0,
    overview: "An action-packed science fiction movie.",
    averageRating: 0, 
    movieCoverPhoto: null, 
    photo: null,
    ageRating: "13+",
    parentalGuidance: "Parental guidance suggested.",
    countryOfOrigin: "USA",
    Language: "English",
    keywords: ["action", "adventure", "fiction"],
    isApproved: true,
    sellerId: new mongoose.Types.ObjectId(),
  };

  const mockedUserData = {
    name: "Maaz Khalid",
    email: "maaz@gmail.com",
    password: "maaz123",
    moviesWishlist: [],
    userPreferences: {
        favoriteGenre: ["Action", "Adventure"],
        favoriteActorsOrDirectors: []
    },
    userActivity: [],
    isSubscribed: true
};

const mockMovie3Data =  {
    title: "Movie 3",
    genre: ["Comedy"],
};

describe("RecommendationController Tests", () => {
    let movie1, movie2, movie3;
    let user;

    beforeAll(async () => {
        // Create mocked data
        movie1 = await Movie.create(mockMovie1Data);
        movie2 = await Movie.create(mockMovie2Data);
        movie3 = await Movie.create(mockMovie3Data);
        user = await User.create({
            ...mockedUserData,
            userActivity: [movie1._id]
        });

        await Review.create({
            user: user._id,
            movie: movie1._id,
            rating: 4,
            content: "Great movie!",
        });
         
    });
    afterEach(async () => {
        await Movie.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});
    });

    test("Should return movies based on user's ratings", async () => {
        // Mock review data
        await Review.create({
            user: user._id,
            movie: movie1._id,
            rating: 4,
            content: "Great movie!",
        });
        user.userActivity.push(movie2._id);
        await user.save();
    
        // Make API call
        const response = await request(app)
            .get(`/movies/genre-user-rating-activity/${user._id}`)
            .expect(200);
    });
    

    test("Should return movies based on user's favorite genres", async () => {
        
        const response = await request(app)
        .get(`/movies/genre-user-rating-activity/${user._id}`)
        .expect(200);
        
        expect(response.body).toBeInstanceOf(Array);

    }); 

    test("Should return 404 if user not found", async () => {
        
        const invalidUserId = new mongoose.Types.ObjectId();
        const response = await request(app)
        .get(`/movies/genre-user-rating-activity/${invalidUserId._id}`)
        .expect(404);

    });

    test("Should return 500 due to Internal Server Error", async () => {
        
        jest.spyOn(User, "findById").mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const response = await request(app)
        .get(`/movies/genre-user-rating-activity/${user._id}`)
        .expect(500);

        jest.restoreAllMocks();
    });

    test("Should return similar movies by genere", async () => {
        
        const response = await request(app)
            .get(`/movies/similar/${movie1._id}`) 
            .expect(200);

        expect(response.body).toHaveLength(1); // Should only return Movie 2
        expect(response.body[0]._id).toBe(movie2._id.toString());
    });

    test("Should return 404 if movie not found", async () => {
        const invalidMovieId = new mongoose.Types.ObjectId(); 

        const response = await request(app)
            .get(`/movies/similar/${invalidMovieId}`)
            .expect(404);

        expect(response.body).toEqual({ message: "Movie not found" });
    });

    test("Should return no similar movies if none match the genre", async () => {
       

        const response = await request(app)
            .get(`/movies/similar/${movie3._id}`) // Comedy genre
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(0); // No similar movies
    });

    test("Should return 500 due to internal server error", async () => {
        // Mock Movie.findById to throw an error
        jest.spyOn(Movie, "findById").mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const response = await request(app)
            .get(`/movies/similar/${movie1._id}`)
            .expect(500);

        expect(response.body).toEqual({ message: "Database error" });

        jest.restoreAllMocks();
    });

});

