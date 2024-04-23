import PetProfile from '../../models/petProfileModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const OWNER_PROFILE_SERVICE_BASE_URL = process.env.OWNER_PROFILE_SERVICE_BASE_URL;
const SERVICE_ACCOUNT_ID = process.env.SERVICE_ACCOUNT_ID
const SECRET_KEY = process.env.JWT_SECRET_KEY;


export const createPetProfile = async (req, res) => {
    try {
        const { ownerProfileId,userId } = req.user; // Extract ownerProfileId from authenticated user token
        const petProfile = new PetProfile({ ...req.body, owner: ownerProfileId });
        const petProfileId = petProfile._id
        await petProfile.save();
        try{
            const SERVICE_ACCOUNT_TOKEN = jwt.sign(
                { SERVICE_ACCOUNT_ID }, 
                SECRET_KEY, 
                { expiresIn: '1h' }
            );
            const ownerProfileResponse = await axios.post(
                `${OWNER_PROFILE_SERVICE_BASE_URL}`+'/api/owner-profiles/update-pets', 
                { userId: userId ,petProfileId:petProfileId, action:"add"}, // Payload can include the User ID or any other necessary info
                {
                    headers: {
                        'Authorization': `Bearer ${SERVICE_ACCOUNT_TOKEN}` // Authenticate the request
                    }
                }
            );
        }catch(error){
            console.error('Failed to create entry in ownerProfile:', error.response ? error.response.data : error.message);
            throw new Error('Failed to create entry in ownerProfile');
        }
        res.status(201).json(petProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePetProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { petProfileId } = req.params;
        const result = await PetProfile.findByIdAndDelete(petProfileId);
        if (!result) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        try{
            const SERVICE_ACCOUNT_TOKEN = jwt.sign(
                { SERVICE_ACCOUNT_ID }, 
                SECRET_KEY, 
                { expiresIn: '1h' }
            );
            const ownerProfileResponse = await axios.post(
                `${OWNER_PROFILE_SERVICE_BASE_URL}`+'/api/owner-profiles/update-pets', 
                { userId: userId ,petProfileId:petProfileId, action:"delete"}, // Payload can include the User ID or any other necessary info
                {
                    headers: {
                        'Authorization': `Bearer ${SERVICE_ACCOUNT_TOKEN}` // Authenticate the request
                    }
                }
            );
        }catch(error){
            console.error('Failed to delete entry in ownerProfile:', error.response ? error.response.data : error.message);
            throw new Error('Failed to delete entry in ownerProfile');
        }
        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePetProfile = async (req, res) => {
    try {
        const { petId } = req.params;
        const petProfile = await PetProfile.findByIdAndUpdate(petId, req.body, { new: true });
        if (!petProfile) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json(petProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
