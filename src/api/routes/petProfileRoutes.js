import express from 'express';
import { createPetProfile, deletePetProfile, updatePetProfile } from '../controllers/petProfileController.js';
import {verifyToken} from '../middleware/authMiddleware.js'; // Assumes you have authentication middleware set up

const router = express.Router();

router.post('/', verifyToken, createPetProfile);
router.delete('/:petProfileId', verifyToken, deletePetProfile);
router.put('/:petProfileId', verifyToken, updatePetProfile);

export default router;
