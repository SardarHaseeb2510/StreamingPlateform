const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Review = require('../modules/reviews/Reviews');
const Movie = require('../modules/movies/Movie');

const mockReviewData = {
  user: new mongoose.Types.ObjectId(),
  movie: new mongoose.Types.ObjectId(),
  rating: 4,
  content: "Great movie!"
};

const mockMovieData = {
    _id: mockReviewData.movie,
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
  
describe("ReviewController Tests", () => {
  beforeAll(async () => {
    await Movie.create(mockMovieData); // Ensure the movie exists before each test
  });

  afterEach(async () => {
    await Review.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new review", async () => {
    const response = await request(app)
      .post("/reviews")
      .send(mockReviewData)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.content).toBe(mockReviewData.content);
  });

  it("should not create a review with invalid rating", async () => {
    
    mockReviewData.rating = 6;
    const response = await request(app)
      .post("/reviews")
      .send(mockReviewData)
      .expect(400);

    expect(response.body.message).toBe("Wrong Rating, please enter between 1-5");
    mockReviewData.rating = 4;
  });

 

  it("should return 404 when updating a non-existent review", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/reviews/${invalidId}`)
      .send(mockReviewData)
      .expect(404);

    expect(response.body.message).toBe("Review not found or unauthorized");
  });

  it("should fetch all reviews for a movie", async () => {
    await Review.create(mockReviewData);

    const response = await request(app)
      .get(`/reviews/movie/${mockReviewData.movie}`)
      .expect(200);

    expect(response.body.reviews).toHaveLength(1);
  });

  it("should return 404 when no reviews found for a movie", async () => {
    const invalidMovieId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/reviews/movie/${invalidMovieId}`)
      .expect(404);

    expect(response.body.message).toBe("No reviews found for this movie");
  });

  it("should delete a review as admin", async () => {
    const review = await Review.create(mockReviewData);

    const response = await request(app)
      .delete(`/reviews/${review._id}`)
      .expect(200);

    expect(response.body.message).toBe("Review deleted successfully");
  });

  it("should return 404 when deleting a non-existent review", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/reviews/${invalidId}`)
      .expect(404);

    expect(response.body.message).toBe("Review not found");
  });

  it("should generate a review pie chart", async () => {
    await Review.create({ ...mockReviewData, rating: 4 });

    const response = await request(app)
      .get(`/reviews/pie-graph/${mockReviewData.movie}`)
      .expect(200);

    expect(response.headers['content-type']).toBe('image/png');
  });

  it("should generate a review bar chart", async () => {
    await Review.create({ ...mockReviewData, rating: 4 });

    const response = await request(app)
      .get(`/reviews/bar-graph/${mockReviewData.movie}`)
      .expect(200);

    expect(response.headers['content-type']).toBe('image/png');
  });
});
