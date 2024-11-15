import{body}from'express-validator';
export const loginValidation=[
    body('email','Неверная почта').isEmail(),
body('password','Неверный формат почты').isLength({min:5}),
]
export const registerValidation=[
body('email','Неверная почта').isEmail(),
body('password','Неверный формат почты').isLength({min:5}),
body('fullName','Пароль должен быть минимум 5 символов').isLength({min:3}),
body('avatarUrl','Неверная ссылка на аватарку').optional().isURL(),
]
export const requestCreateValidation=[
body('Title','Введите название компании').isLength({min:3}).isString(),
body('Bank','Введите рекламный бюджет($)').isFloat({min:0}),
body('Following','Введите количество ожидаемых переходов по ссылке').isInt({min:0}),
body('Purchases','Введите количество ожидаемых покупок').isInt({min:0}),
body('CAge','Введите возраст потребителя').isInt({min:0}),
body('Country','Введите страну потребителя').isLength({min:2}),
body('ImageUrl','Неверная ссылка на изображение').optional().isString(),
]