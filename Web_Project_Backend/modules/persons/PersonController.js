const Person = require('./Person');

// Create a new person
const createPerson = async (req, res) => {
    try {
        const { name, country, gender, age, biography, photos } = req.body;
        // Create a new person
        const person = new Person({
            name,
            country,
            gender,
            age,
            biography,
            photos
        });

        await person.save();
        res.status(201).json({ data: person, message: 'Person created successfully' });
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

// Get a person by ID
const getPersonById = async (req, res) => {
    try {
        const id = req.params.id;
        const person = await Person.findById(id);        
        if (person) {
            res.status(200).json({ data: person });
        } else {
            return res.status(404).json({ data: null, message: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

// Get all persons with pagination
const getPersons = async (req, res) => {
    try {
       
        const persons = await Person.find()

        if (persons.length === 0) {
            return res.status(404).json({ message: "No persons found" });
        }

        // Send the response with pagination information
        res.status(200).json({
            data: persons
        });
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

// Update a person
const updatePerson = async (req, res) => {
    try {
        const { name, country, gender, age, biography, photos } = req.body;

        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id,
            { name, country, gender, age, biography, photos },
            { new: true, runValidators: true } 
        );

        if (!updatedPerson) {
            return res.status(404).json({ data: null, message: 'Person not found' });
        }

        res.status(200).json({ data: updatedPerson, message: 'Person updated successfully' });
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

// Delete a person
const deletePerson = async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);

        if (!person) {
            return res.status(404).json({ data: null, message: 'Person not found' });
        }

        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ data: null, message: error.message });
    }
};

module.exports = {
    createPerson,
    getPersons,
    getPersonById,
    updatePerson,
    deletePerson,
};
