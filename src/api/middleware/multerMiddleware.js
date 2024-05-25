import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      cb(null, '../bettersoon_webclient/public/assets/sandbox_uploads/petProfilePictures'); // Directory for profile pictures
    } else if (file.fieldname === 'medicalHistory') {
      cb(null, '../bettersoon_webclient/public/assets/sandbox_uploads/petProfileMedicalFiles'); // Directory for medical history files
    } else if (file.fieldname === 'vaccinations') {
      cb(null, '../bettersoon_webclient/public/assets/sandbox_uploads/petProfileVaccinationFiles'); // Directory for medical history files
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

export default upload;
