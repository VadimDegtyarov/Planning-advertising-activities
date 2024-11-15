import RequestModel from '../models/Request.js'
import UserModel from '../models/user.js';
export const create = async (req, res) => {
    try {

        const doc = new RequestModel({
            Title: req.body.title,
            Bank: req.body.Bank,
            Following: req.body.Following,
            Purchases: req.body.Purchases,
            CAge: req.body.CAge,
            Country: req.body.Country,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            profit: req.body.profit || 0
        });

        const request = await doc.save();

        res.json(request);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать запрос',
        })
    }
}
export const getAll = async (req, res) => {
    try {
        const requests = await RequestModel.find().populate('user')
        .exec();
        

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Не удалось получить все запросы' });
    }
};


export const getOne = async (req, res) => {
    try {
        const requestId = req.params.id;

        const request = await RequestModel.findById(requestId).populate('user');

        res.json(request);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить запрос',
        })
    }
};
export const remove = async (req, res) => {
    try {
        const requestId = req.params.id;

        const requestDel = await RequestModel.findByIdAndDelete(requestId);

        res.json({ success: true, });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось Удалить запрос',
        })
    }
}
export const update = async (req, res) => {
    try {
        const requestId = req.params.id;

        await RequestModel.updateOne({
            _id: requestId,
        },
            {

                Title: req.body.title,
            Bank: req.body.Bank,
            Following: req.body.Following,
            Purchases: req.body.Purchases,
            CAge: req.body.CAge,
            Country: req.body.Country,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            profit: req.body.profit || 0

            });

          
            res.json({ success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить запрос',
        })
    }
}