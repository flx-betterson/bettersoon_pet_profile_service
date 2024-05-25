import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const petProfileSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'OwnerProfile', // Adjust 'OwnerProfile' to match your actual user profile model name
    },
    name: { type: String, required: true },
    profilePicture:{type:String},
    birthday: { type: Date, required: true },
    animalkind: { type: String, required: true, enum: ['cat', 'dog', , /* other kinds */] },
    breed: { type: String, required: true }, // You might later want to customize validation based on the animalkind
    gender: { type: String, required: true, enum: ['male', 'female'] },
    weight: { type: Number },
    height: { type: Number },
    allergies: [String], // List of allergies as strings
    vaccinations:[String],
    preexistingConditions: [String], 
    medicalHistory:[String],
    diagnoses: [{
        type: Schema.Types.ObjectId,
        ref: 'Diagnosis', // Reference to a yet-to-be-created Diagnosis model
    }],
    diet: { type: String, required: false }, // Diet description
}, { timestamps: true }); // Include creation and update timestamps

const PetProfile = model('PetProfile', petProfileSchema);

export default PetProfile;
