const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const WatchHistory = require("../modules/watchHistory/WatchHistory.js");
const { User } = require("../modules/adminSellerUser/AdminSellerUser.js");
const Movie = require('../modules/movies/Movie');

// Mock data for testing
const mockUserData = {
  name: "Test User",
  email: "test@example.com"
};

const mockMovieData = {
  title: "Test Movie",
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

const mockWatchHistoryData = {
  userId: new mongoose.Types.ObjectId(),
  movies: []
};

describe("Watch History Controller Tests", () => {
  let user, movie, watchHistory;

  // Setup before each test
  beforeAll(async () => {
    // Create mock user and movie
    user = await User.create(mockUserData);
    movie = await Movie.create(mockMovieData);

    // Create mock watch history with a movie
    watchHistory = await WatchHistory.create({
      userId: user._id,
      movies: [movie._id]
    });
  });

  afterEach(async () => {
    // Clean up collections
    await WatchHistory.deleteMany({});
    await User.deleteMany({});
    await Movie.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return the user's watch history with pagination info", async () => {
    const response = await request(app)
      .get(`/watch-history/${user._id}?page=1&limit=1`)
      .expect(200);

    expect(response.body.watchHistory.movies).toHaveLength(1);
    expect(response.body.pagination.currentPage).toBe(1);
    expect(response.body.pagination.totalItems).toBe(1);
    expect(response.body.pagination.itemsPerPage).toBe(1);
  });

  it("should return 404 if the user's watch history does not exist", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/watch-history/${nonExistentUserId}`)
      .expect(404);

    expect(response.body.message).toBe("Watch history not found");
  });

  it("should return 500 if an error occurs", async () => {
    // Mock error scenario
    jest.spyOn(WatchHistory, "findOne").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .get(`/watch-history/${user._id}`)
      .expect(500);

    expect(response.body.message).toBe("Database error");

    jest.restoreAllMocks();
  });

  it("should successfully add a movie to the watch history and increment views", async () => {
    
    const newUser = await User.create(mockUserData);
    const newMovie = await Movie.create(mockMovieData);
    
    let watchHistory = await WatchHistory.create({
        userId: newUser._id,
        movies: []
    });

    // Make the POST request to add the movie to the watch history
    const response = await request(app)
      .post("/watch-history")
      .send({ userId: watchHistory.userId, movieId: newMovie._id})
      .expect(200);

    const updatedMovie = await Movie.findById(newMovie._id);

    // Ensure that the movie's view count has been incremented by 1
    expect(updatedMovie.views).toBe(1);

    // Ensure the movie was added to the watch history in the response
    expect(response.body.movies).toContain(newMovie._id.toString());
});

  it("should not add a movie to the watch history if it's already there", async () => {
    
    const newUser = await User.create(mockUserData);
    const newMovie = await Movie.create(mockMovieData);
    // Add the movie to the history first
    await WatchHistory.create({
      userId: user._id,
      movies: [newMovie._id],
    });

    const response = await request(app)
      .post("/watch-history")
      .send({ userId: user._id, movieId: newMovie._id })
      .expect(400);

    expect(response.body.message).toBe("Movie already in watch history");
  });

  it("should create a new watch history if none exists for the user", async () => {
    const newMovie = await Movie.create({ ...mockMovieData, title: "New Movie" });
    const response = await request(app)
      .post("/watch-history")
      .send({ userId: user._id, movieId: newMovie._id })
      .expect(200);

    expect(response.body.movies).toHaveLength(1); // Watch history should have one movie
    expect(response.body.movies[0].toString()).toBe(newMovie._id.toString()); // Ensure the new movie is added
  });

  it("should remove the oldest movie from the history when the limit of 10 movies is exceeded", async () => {
    // Create more than 10 movies
    for (let i = 1; i <= 11; i++) {
      const newMovie = await Movie.create({ ...mockMovieData, title: `Movie ${i}` });
      await request(app)
        .post("/watch-history")
        .send({ userId: user._id, movieId: newMovie._id })
        .expect(200);
    }

    const watchHistory = await WatchHistory.findOne({ userId: user._id });
    expect(watchHistory.movies.length).toBe(10); // The watch history should only have the 10 most recent movies
  });

  it("should return 404 if the movie does not exist", async () => {
    const invalidMovieId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post("/watch-history")
      .send({ userId: user._id, movieId: invalidMovieId })
      .expect(404);

    expect(response.body.message).toBe("Movie not found");
  });

  it("should return 500 if an error occurs", async () => {
    // Mock error scenario
    jest.spyOn(WatchHistory, "findOne").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const newUser = await User.create(mockUserData);
    const newMovie = await Movie.create(mockMovieData);
    // Add the movie to the history first
    await WatchHistory.create({
      userId: user._id,
      movies: [newMovie._id],
    });

    const response = await request(app)
      .post("/watch-history")
      .send({ userId: newUser._id, movieId: newMovie._id })
      .expect(500);

    expect(response.body.message).toBe("Database error");

    jest.restoreAllMocks();
  });

  it("should successfully delete a movie from watch history", async () => {
   
    const newUser = await User.create(mockUserData);
    const newMovie = await Movie.create(mockMovieData);
    
    await WatchHistory.create({
      userId: newUser._id,
      movies: [newMovie._id]
    });

    const response = await request(app)
      .delete(`/watch-history/${newUser._id}/${newMovie._id}`)
      .expect(200);

    // Ensure the response contains the updated watch history
    expect(response.body.movies).not.toContain(movie._id.toString());
  });

  it("should return 404 if the watch history does not exist", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/watch-history/${nonExistentUserId}/${movie._id}`)
      .expect(404);

    expect(response.body.message).toBe("Watch history not found");
  });

  it("should return 404 if the movie is not found in the watch history", async () => {
    
    const nonExistentMovieId = new mongoose.Types.ObjectId();
    const newUser = await User.create(mockUserData);
    const newMovie = await Movie.create(mockMovieData);
    
    await WatchHistory.create({
      userId: newUser._id,
      movies: [newMovie._id],
    });
    const response = await request(app)
      .delete(`/watch-history/${user._id}/${nonExistentMovieId}`)
      .expect(404);

    expect(response.body.message).toBe("Watch history not found");
  });

  it("should return 500 if an error occurs while fetching watch history", async () => {
    // Mock error scenario
    jest.spyOn(WatchHistory, "findOne").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .delete(`/watch-history/${user._id}/${movie._id}`)
      .expect(500);

    expect(response.body.message).toBe("Database error");

    jest.restoreAllMocks();
  });

  

});

