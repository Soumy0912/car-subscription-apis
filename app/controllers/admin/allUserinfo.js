import express from "express";
import User from "../../models/user/user.js";
import { sendResponse} from "../../utils/handleresponse.js";
import { getpagination } from "../../utils/pagination.js";

export const allUserinfo = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 2;
        const limit = parseInt(req.query.limit) || 2;
        const skipIndex = (page - 1) * limit;
        const totalUsers = await User.countDocuments();
        const pagination = getpagination(totalUsers,page,limit);
        const user = await User.find()
            .select("-password")
            .skip(skipIndex)
            .limit(limit);
        return sendResponse(res,200,{user,pagination},"hello");

    } catch (error) {
        return sendResponse(res,500,null,error.message);
    }
};
