import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


import UserModel from '../models/user.js';
import { UserController } from './index.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarURL,
            passwordHash: Hash
        });

        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,
        }, 'secret123',
            {
                expiresIn: '30d',
            });

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });

    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        });
    }
};
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            });
        const { passwordHash, ...userData } = user._doc;

        res.json(
            {
                ...userData,
                token,
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json({ userData });
    }
    catch (err) {

    }
};
export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find();
        console.log('1')

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось получить всех пользователей' });
    }
};

export const removeUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userDel = await UserModel.findByIdAndDelete(userId);

        if (!userDel) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить пользователя',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить запрос',
        });
    }
};
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const password = req.body.password;
        
        if (!password) {
            return res.status(400).json({ message: 'Пароль не может быть пустым' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const { passwordHash, ...userData } = updatedUser._doc;
        res.json({ success: true, userData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Произошла ошибка при обновлении пользователя' });
    }
};
    
