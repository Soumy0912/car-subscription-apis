import joi from "joi";

const uservalid = joi.object({
    role: joi.string().valid('user','admin'),
    name: joi.string().required().min(3).max(20),
    email: joi.string().email().required(),
    password: joi.string().required().length(8),
    phone: joi.number().required().min(1000000000).max(9999999999),
    address: joi.string()
})
export default uservalid;