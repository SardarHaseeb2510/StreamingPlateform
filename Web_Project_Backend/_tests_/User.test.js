const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const { User } = require('../modules/adminSellerUser/AdminSellerUser.js');
const Movie = require("../modules/movies/Movie")

// Mocked User Data
const mockUserData = {
  name: 'Maaz Khalid',
  email: 'maaz@gmail.com',
  password: 'maaz123'
};

const mockMovieData = {
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
  isApproved: true
};

beforeEach(async () => {
  await User.deleteMany({});
  await Movie.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('UserController Tests', () => {

  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Maaz Khalid',
        email: 'maaz05@example.com',
        password: 'maaz123'
      })
      .expect(201);

    expect(response.body.email).toBe('maaz05@example.com');
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Maaz Khalid',
        password: 'maaz123'
      })
      .expect(400);

    expect(response.text).toBe('Invalid Fields');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Maaz Khalid',
        email: 'maaz05.com',
        password: 'maaz123'
      })
      .expect(400);

    expect(response.text).toBe('Invalid email format');
  });

  it('should return 400 if the user already exists', async () => {
    await User.create({
      name: 'Maaz Khalid',
      email: 'maaz05@gmail.com',
      password: 'maaz123'
    });

    const response = await request(app)
      .post('/user/register')
      .send({
        name: 'Maaz Khalid',
        email: 'maaz05@gmail.com',
        password: 'maaz123'
      })
      .expect(400);

    expect(response.text).toBe('User already exists');
  });

  it('should fetch the user profile successfully', async () => {
    
    const newUser = await User.create(mockUserData);

    const response = await request(app)
      .get(`/user/profile/${newUser._id}`) 
      .expect(200); 

    expect(response.body._id).toBe(newUser._id.toString());
  });

  it('should return 404 if the user does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .get(`/user/profile/${nonExistentId}`) // Pass non-existent user ID in the route
      .expect(404);

    expect(response.body.message).toBe('User not found');
});

  it('should fetch the subscription status successfully', async () => {
    
    const newUser = await User.create({
      name: 'Maaz Khaan',
      email: 'maaz01@example.com',
      password: 'maaz124',
      isSubscribed: true
    });

    const response = await request(app)
        .get(`/getSubscriptionForUser/${newUser._id}`)
        .expect(200);

    expect(response.body).toBe(true);
  });
  
  it('should return 404 if the user does not exist', async () => {
    
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/getSubscriptionForUser/${nonExistentUserId}`)
      .expect(404);
    
  });

  it('should return 500 When Exception Occurs for getSubscriptionForUser', async () => {
    const mockErrorMessage = 'Database error';

    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error(mockErrorMessage);
    });

    const userId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/getSubscriptionForUser/${userId}`)
      .expect(500);

    expect(response.body.message).toBe(mockErrorMessage);

    User.findById.mockRestore();
  });

  it('should fetch all users successfully', async () => {
    await User.create({
      name: "Haseeb Sajid",
      email: 'haseeb@gmail.com',
      password: 'haseeb123'
    });

    const response = await request(app)
    .get('/user/all')
    .expect(200);

  });

  it('should update a user profile successfully', async () => {
    
    const newUser2 = await User.create({
      name: 'Maaz Ali',
      email: 'maaz10@gmail.com',
      password: 'mali123'
    });

    const response = await request(app)
      .put('/user/update')
      .send({
        _id: newUser2._id,
        name: 'Maaz Updated',
        email: 'maaz10@gmail.com'
      })
      .expect(200);
  });

  it('should return 404 if the user to update is not found', async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put('/user/update')
      .send({ _id: nonExistentUserId, name: 'Updated Name' })
      .expect(404);

    expect(response.body.message).toBe('User not found');
  });

  it('should return 500 if an error occurs while updating user profile', async () => {
    
    jest.spyOn(User, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Database update error');
    });
  
    const newUser = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123'
    });
    const response = await request(app)
      .put('/user/update')
      .send({
        _id: newUser._id,
        name: 'Updated Name',
        email: 'updated@gmail.com'
      })
      .expect(500);
      
      User.findByIdAndUpdate.mockRestore(); // Correct method
  });

  it('should delete a user successfully', async () => {
    const user = await User.create({
      name: 'Mark Smith',
      email: 'mark@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .delete(`/user/delete/${user._id}`)
      .expect(200); 

    expect(response.body.message).toBe('User deleted successfully');
  });

  it('should return 404 if the user to delete is not found', async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/user/delete/${nonExistentUserId}`)
      .expect(404);

    expect(response.body.message).toBe('User not found or already deleted');
  });

  it('should return 400 if user ID is missing', async () => {
    const response = await request(app)
    .delete('/user/delete/')
    .expect(404);
  });

  it('should return 500 if an error occurs during user deletion', async () => {
    jest.spyOn(User, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Database deletion error');
    });
    const user = await User.create({
      name: 'Mark Smith',
      email: 'mark@example.com',
      password: 'password123'
    });
  
    const response = await request(app)
      .delete(`/user/delete/${new mongoose.Types.ObjectId()}`)
      .expect(500);

      User.findByIdAndDelete.mockRestore();
  });

  it('should get Movies from user wishlist with 200 response', async () => {
    
    const newUser2 = await User.create({
      name: 'Danish Rafique',
      email: 'danish@gmail.com',
      password: 'danish123'
    });

    const newMovie =  await Movie.create(mockMovieData);
    newUser2.moviesWishlist.push(newMovie._id); 
    await newUser2.save(); 
  
    const response = await request(app)
      .get(`/user/wishlist/${newUser2._id}`)
      .expect(200);
  });

  it('should return 404 when movie is not found in the wishlist', async () => {
    
    const InvalidUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/user/wishlist/${InvalidUserId}`)
      .expect(404);
  });


  it('should return a 500 server error if there is an issue fetching user wishlist', async () => {
    
    const newUserData = await User.create({
      name: 'Danish Rafique',
      email: 'danish@gmail.com',
      password: 'danish123'
    });

    const newMovie = await Movie.create(mockMovieData);
    newUserData.moviesWishlist.push(newMovie._id); 
    await newUserData.save();

    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      throw new Error('Database connection error');
    });

    const response = await request(app)
      .get(`/user/wishlist/${newUserData._id}`)
      .expect(500); 
      
      User.findById.mockRestore();
  });
});
