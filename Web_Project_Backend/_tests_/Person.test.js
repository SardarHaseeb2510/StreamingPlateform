//Person.test.js File

const Person = require("../modules/persons/Person");
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

const mockPersonData = {
  name: "Maaz Khalid",
  country: "Pakistan",
  gender: "Male",
  age: 30,
  biography: "A Software Engineer..",
  photos: [],
};

describe("PersonController Tests", () => {
  beforeAll(async () => {
    
})
  

  afterEach(async () => {
    await Person.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new person", async () => {
    const response = await request(app)
      .post("/persons")
      .send(mockPersonData)
      .expect(201);

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.message).toBe("Person created successfully");
  });

  it("should fetch a person by ID", async () => {
    const person = await Person.create(mockPersonData);

    const response = await request(app)
      .get(`/persons/${person._id}`)
      .expect(200);

    expect(response.body.data).toHaveProperty("_id", person.id);
    expect(response.body.data.name).toBe(mockPersonData.name);
  });

  it("should return 500 when fetching a non-existent person", async () => {
    const fakeId = '123';
    const response = await request(app)
      .get(`/persons/${fakeId}`)
      .expect(500);

  });

  it("should fetch all persons", async () => {
    await Person.create(mockPersonData);
    await Person.create({ ...mockPersonData, name: "Jane Doe" });

    const response = await request(app)
      .get("/persons")
      .expect(200);

    expect(response.body.data).toHaveLength(2);
  });

  it("should return 404 when no persons exist", async () => {
    const response = await request(app)
      .get("/persons")
      .expect(404);

    expect(response.body.message).toBe("No persons found");
  });

  it("should return 500 when database operation fails in getPersons", async () => {
    
    jest.spyOn(Person, "find").mockImplementationOnce(() => {
      throw new Error("Database operation failed");
    });
  
    const response = await request(app)
      .get("/persons")
      .expect(500);
  
    expect(response.body.data).toBeNull();
    expect(response.body.message).toBe("Database operation failed");
  
    Person.find.mockRestore();
  });
  

  it("should return 404 for person that doesnot exist", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    
    const response = await request(app)
      .get(`/persons/${invalidId}`)
      .expect(404);

    expect(response.body.message).toBe("Person not found");
  });

  it("should update an existing person", async () => {
    const person = await Person.create(mockPersonData);

    const updatedData = { ...mockPersonData, name: "Updated Name" };
    const response = await request(app)
      .put(`/persons/${person._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.data.name).toBe(updatedData.name);
    expect(response.body.message).toBe("Person updated successfully");
  });

  it("should return 404 when updating a non-existing person", async () => {
  
    const nonExistentId = new mongoose.Types.ObjectId();
    const updatedData = { ...mockPersonData, name: "Updated Name" };

    const response = await request(app)
      .put(`/persons/${nonExistentId}`)
      .send(updatedData)
      .expect(404);
  
    expect(response.body.data).toBeNull();
    expect(response.body.message).toBe("Person not found");
  });
  

  it("should return 500 when updating a non-existent person", async () => {
    const fakeId = '123';
    const response = await request(app)
      .put(`/persons/${fakeId}`)
      .send(mockPersonData)
      .expect(500);

  });

  it("should delete an existing person", async () => {
    const person = await Person.create(mockPersonData);

    const response = await request(app)
      .delete(`/persons/${person._id}`)
      .expect(200);

    expect(response.body.message).toBe("Person deleted successfully");
  });

  it("should return 500 when deleting a non-existent person", async () => {
    const fakeId = '123';
    const response = await request(app)
      .delete(`/persons/${fakeId}`)
      .expect(500);

  });

  it("should handle errors gracefully when database operations fail", async () => {
    jest.spyOn(Person.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app)
      .post("/persons")
      .send(mockPersonData)
      .expect(500);

    expect(response.body.message).toBe("Database error");
  });

  it("should return 404 when deleting a non-existing person", async () => {
    
    const nonExistentId = new mongoose.Types.ObjectId();
  
    const response = await request(app)
      .delete(`/persons/${nonExistentId}`)
      .expect(404);
  
    expect(response.body.data).toBeNull();
    expect(response.body.message).toBe("Person not found");
  });
  

});