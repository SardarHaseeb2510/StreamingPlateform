const request = require('supertest');
const { AdminSeller } = require("../modules/adminSellerUser/AdminSellerUser");
const SellerCard = require("../modules/adminSellerUser/SellerCard");
const mongoose = require('mongoose');
const app = require('../index');

describe("SellerCardController Tests", () => {
    
    beforeAll(async () => {
      
    });

    afterEach(async () => {
        await SellerCard.deleteMany({});
        await AdminSeller.deleteMany({});
      });

    it('should save card details successfully when valid data is provided', async () => {
        
        const seller = await AdminSeller.create({
            name: 'Maaz Khalid',
            email: 'maaz@gmail.com',
            password: 'maaz123',
            role: 'seller'
        });
    
        const cardDetails = {
            sellerId: seller._id,
            cardHolderName: 'Maaz Khalid',
            cardNumber: '4121311111111111',
            expiryDate: '12/24',
            cvv: '123'
        };
    
        const response = await request(app)
            .post('/seller/card-details')
            .send(cardDetails)
            .expect(201);
    
        expect(response.body.message).toBe('Card details saved successfully');
        expect(response.body.card).toHaveProperty('cardHolderName', cardDetails.cardHolderName);
        expect(response.body.card).toHaveProperty('cardNumber', cardDetails.cardNumber);
    
    });
    
    it('should return 404 if the seller is not found', async () => {
        
        const nonExistentSellerId = new mongoose.Types.ObjectId();
        const cardDetails = {
            sellerId: nonExistentSellerId,
            cardHolderName: 'Maaz Khalid',
            cardNumber: '4111111111111111',
            expiryDate: '12/24',
            cvv: '123'
        };
    
        const response = await request(app)
            .post('/seller/card-details')
            .send(cardDetails)
            .expect(404);
    
        expect(response.body.error).toBe('Seller not found');
    });
    
    it('should return 500 if an error occurs while saving the card details', async () => {
        const mockErrorMessage = 'Database error';
    
        // Mock the behavior of the SellerCard model to simulate a failure
        jest.spyOn(SellerCard.prototype, 'save').mockImplementationOnce(() => {
            throw new Error(mockErrorMessage);
        });
    
        const seller = await AdminSeller.create({
            name: 'Maaz Khalid',
            email: 'maaz@gmail.com',
            password: 'maaz123',
            role: 'seller',
        });
    
        const cardDetails = {
            sellerId: seller._id,
            cardHolderName: 'Maaz Khalid',
            cardNumber: '4111111111111111',
            expiryDate: '12/24',
            cvv: '123',
        };
    
        const response = await request(app)
            .post('/seller/card-details')
            .send(cardDetails)
            .expect(500);
    
        expect(response.body.error).toBe(mockErrorMessage);

        SellerCard.prototype.save.mockRestore();  
    });
    
});  