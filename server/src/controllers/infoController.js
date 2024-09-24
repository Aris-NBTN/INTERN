import { StatusCodes } from 'http-status-codes';

const allInfo = async (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({ message: 'Thông tin đã được cập nhật thành công.' });
    } catch (error) {
        next(error);
    }
}

const updateInfo = async (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({ message: 'Thông tin đã được cập nhật thành công.' });
    } catch (error) {
        next(error);
    }
}


export const infoController = {
    allInfo,
    updateInfo
}
