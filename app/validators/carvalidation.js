import joi from "joi";

const carvalid = joi.object({
    carname: joi.string().required(),
    brand: joi.string().required(),
    model: joi.string().required(),
    monthlyprice: joi.string().required(),
    carImage: joi.string(),
    registration_number: joi.string().required(),
    availability_status: joi.string()
})
export default carvalid;