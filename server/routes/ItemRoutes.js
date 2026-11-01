import express from 'express';
import createItem from '../controllers/Items/CreateItem.js';
import { validateJWT } from '../middlewares/validateToken.js';
import getAllItems from '../controllers/Items/getAllItems.js';
import getItemById from '../controllers/Items/getItemById.js';
import updateItem from '../controllers/Items/updateItem.js';
import deleteItem from '../controllers/Items/deleteItem.js';
import upload from '../models/upload.js';
import addComment from '../controllers/Items/addComment.js';
import { sendComment } from "../controllers/Items/sendComment.js";
import archiveItem from '../controllers/Items/archiveItem.js' // ✅ ADD
import retrieveItem from '../controllers/Items/retrieveItem.js' // ✅ ADD
import getArchivedItems from '../controllers/Items/getArchivedItems.js' // ✅ ADD

const router = express.Router();

// ✅ UNA: SPECIFIC ROUTES BAGO ANG DYNAMIC ROUTES
router.get('/archived', getArchivedItems); // ✅ ILAGAY MO ITO BAGO ANG :id ROUTE


// Return a helpful error for invalid images, file-size limits, or storage problems.
const uploadImages = (req, res, next) => {
  upload.array("images", 5)(req, res, (error) => {
    if (!error) return next();
    console.error("Image upload failed:", error);
    const isClientError = error.name === 'MulterError' ||
      error.message === "Only image files are allowed.";
    return res.status(isClientError ? 400 : 500).json({
      ok: false,
      msg: error.code === "LIMIT_FILE_SIZE"
        ? "Image is too large. Maximum 10 MB per image."
        : error.code === "LIMIT_UNEXPECTED_FILE"
          ? "Too many images or invalid image field. Maximum 5 images."
          : isClientError ? error.message : "Unable to save image on the server.",
    });
  });
};

router.post('/newItem', validateJWT, uploadImages, createItem);
router.get('/:id', getItemById);
router.get('/', getAllItems);
router.put('/update/:id', validateJWT, uploadImages, updateItem);
router.delete('/delete/:id', deleteItem);

// ✅ DAGDAGAN MO NG MGA ROUTES
router.put('/archive/:id', archiveItem)
router.put('/retrieve/:id', retrieveItem)

router.post('/:id/comment', validateJWT, addComment);
router.post("/sendComment/:itemId", validateJWT, sendComment);

export default router;