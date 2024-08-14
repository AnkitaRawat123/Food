import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';

// Ensure the 'uploads' directory exists
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const foodRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), (req, res, next) => {
    
    next();
}, addFood);

foodRouter.get("/list", (req, res, next) => {
    
    next();
}, listFood);
foodRouter.post("/remove",removeFood)


export default foodRouter;
