import exp from 'constants';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, requestCreateValidation } from './Validations.js'
import { UserController, RequestController } from './Controllers/index.js';
import { CheckAuth, handleValidationErrors } from './Utils/index.js';


mongoose.connect('mongodb://localhost:27017/CourseWork3').then(() => console.log('DB ok'))
    .catch(() => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', CheckAuth, UserController.getMe);
app.patch('/auth/me', CheckAuth, UserController.getMe);
app.post('/upload', CheckAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,

    });
});

app.get('/requests', RequestController.getAll);
app.get('/requests/:id', RequestController.getOne);
app.post('/requests', CheckAuth, handleValidationErrors, RequestController.create);
app.delete('/requests/:id', CheckAuth, RequestController.remove);
app.patch('/requests/:id', CheckAuth, handleValidationErrors, RequestController.update);

app.delete('/users/:id', handleValidationErrors, UserController.removeUser);
app.get('/users', handleValidationErrors, UserController.getAll);


app.get('/auth/:id', handleValidationErrors, UserController.getOne);
app.patch('/users/:id', handleValidationErrors, UserController.updateUser);




app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
});