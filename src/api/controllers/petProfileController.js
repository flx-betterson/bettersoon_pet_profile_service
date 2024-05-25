import PetProfile from '../../models/petProfileModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import { getBirthdateFromAge } from '../../services/ageService.js';

dotenv.config();

const OWNER_PROFILE_SERVICE_BASE_URL = process.env.OWNER_PROFILE_SERVICE_BASE_URL;
const SERVICE_ACCOUNT_ID = process.env.SERVICE_ACCOUNT_ID
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const createPetProfile = async (req, res) => {
    console.log("create petProfile controller triggered")
    try {
        const {profilePicture, medicalHistory,vaccinations}=req.files;
        console.log("vaccinations:",vaccinations)
        console.log("profilePicture:",profilePicture)
        const SERVICE_ACCOUNT_TOKEN = jwt.sign(
            { SERVICE_ACCOUNT_ID }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        const { userId } = req.user;
        const response = await axios.get(`${OWNER_PROFILE_SERVICE_BASE_URL}`+'/api/owner-profiles/me-id',{
            headers: {
                'Authorization': `Bearer ${SERVICE_ACCOUNT_TOKEN}` // Authenticate the request
            }
        })

        const ownerProfileId=response.data;
        if(req.body.birthday){
            req.body.birthday = getBirthdateFromAge(req.body.age)
            req.body.age = null
        }

        if (profilePicture) {
            req.body.profilePicture = profilePicture[0].filename;
        }
        if (vaccinations) {
            req.body.vaccinations = vaccinations[0].filename;
        }
        if (!Array.isArray(req.body.medicalHistory)) {
            if(req.body.medicalHistory==undefined||req.body.medicalHistory==""){
                req.body.medicalHistory = [];
            }
            else{
                req.body.medicalHistory=[req.body.medicalHistory]
            }
        }
        if (medicalHistory && medicalHistory.length > 0) {
            medicalHistory.forEach(file => req.body.medicalHistory.push(file.filename));
        }
        if(req.body.allergies&&Array.isArray(req.body.allergies)){
            console.log("allergies:",req.body.allergies)
            req.body.allergies=req.body.allergies.filter(item=>item!="");
        }else if(req.body.allergies){
            req.body.allergies=[req.body.allergies];
        }
        if(req.body.preexistingConditions&&Array.isArray(req.body.preexistingConditions)){
            req.body.preexistingConditions=req.body.preexistingConditions.filter(item=>item!="");
        }else if(req.body.preexistingConditions){
            req.body.preexistingConditions=[req.body.preexistingConditions]
        }
        const petProfile = new PetProfile({ ...req.body, owner: ownerProfileId });
        const petProfileId = petProfile._id
        await petProfile.save();
        try{
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
            console.error('Failed to create entry in ownerProfile:', error);
            res.status(402).json({ message: error });
            throw new Error('Failed to create entry in ownerProfile');
        }
        res.status(201).json(petProfile);
    }catch(error){
        console.log("error:",error)
        res.status(401).json({ message: error });
    } // Extract ownerProfileId from authenticated user token

};

export const getPetProfile = async (req, res) => {
    console.log("Get Pet Profile controller triggered")
    try {
        const { petProfileId } = req.params;  // Extract the petProfileId from the request parameters
        const petProfile = await PetProfile.findById(petProfileId);
        if (!petProfile) {
            return res.status(404).json({ message: 'Pet not found' });  // Return an error if no pet profile is found
        }
        console.log("petProfile:",petProfile)
        res.status(200).json(petProfile);  // Send the pet profile back to the client
    } catch (error) {
        console.error('Error fetching pet profile:', error);
        res.status(500).json({ message: 'Error fetching pet profile' });  // Handle possible errors in fetching the pet profile
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
            await axios.post(
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
    console.log("update pet profile controller triggered")
    console.log("req.body:",req.body)
    try {
        const { petProfileId } = req.params;
        const { profilePicture, medicalHistory, vaccinations } = req.files;
        console.log("profilePicture:",profilePicture)
        console.log("medicalHistory:",medicalHistory)
        console.log("vaccinations:",vaccinations)
        if (profilePicture) {
            req.body.profilePicture = profilePicture[0].filename;
        }
        if (vaccinations) {
            req.body.vaccinations = vaccinations[0].filename;
        }
        if (!Array.isArray(req.body.medicalHistory)) {
            if(req.body.medicalHistory==undefined||req.body.medicalHistory==""){
                req.body.medicalHistory = [];
            }
            else{
                req.body.medicalHistory=[req.body.medicalHistory]
            }
        }
        if (medicalHistory && medicalHistory.length > 0) {
            medicalHistory.forEach(file => req.body.medicalHistory.push(file.filename));
        }
        if(req.body.allergies){
            console.log("if entered")
            req.body.allergies=req.body.allergies.filter(item=>item!=="");
        }
        if(req.body.preexistingConditions){
            console.log("if entered")
            req.body.preexistingConditions=req.body.preexistingConditions.filter(item=>item!=="");
        }
        const petProfile = await PetProfile.findByIdAndUpdate(petProfileId, req.body, { new: true });
        if (!petProfile) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        console.log("updatedPorfile:",petProfile)
        res.status(200).json(petProfile);

    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const modifyConnectedDiagnosis= async (req,res)=>{
    try{
        const {petProfileId, diagnosisId}=req.body.data;
        const pet = await PetProfile.findById(petProfileId);
        if(!pet){
            return res.status(404).json({message:"Pet profile not found"})
        }
        pet.diagnoses.push(diagnosisId);
        await pet.save();
        res.status(200).json({message:`Diagnosis ${diagnosisId} added successfully`,profile:pet});
    }catch(error){
        res.status(500).json({ error: error.message }); 
    }
}