import express from 'express';
import { createPetProfile, deletePetProfile, updatePetProfile, getPetProfile, modifyConnectedDiagnosis } from '../controllers/petProfileController.js';
import {verifyServiceToken, verifyToken} from '../middleware/authMiddleware.js'; // Assumes you have authentication middleware set up
import upload from '../middleware/multerMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, 
                upload.fields([
                        {name:'profilePicture', maxCount:1},
                        {name:'medicalHistory', maxCount:10},
                        {name:'vaccinations', maxCount:1},
                        ]), 
                        createPetProfile);
router.get('/:petProfileId',verifyToken,getPetProfile);
router.delete('/:petProfileId', verifyToken, deletePetProfile);
router.put('/:petProfileId', verifyToken, 
                upload.fields([
                        {name:'profilePicture', maxCount:1},
                        {name:'medicalHistory', maxCount:10},
                        {name:'vaccinations', maxCount:1},
                ]), 
                updatePetProfile);
router.post('/update-diagnosis',verifyServiceToken,modifyConnectedDiagnosis);

export default router;
