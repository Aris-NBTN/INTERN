import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';

// const filePath = path.resolve(__dirname, '../json/menu.json');
// let file = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const allMenu = async (req, res, next) => {
    // try {
    //     res.status(StatusCodes.OK).json(file);
    // } catch (error) {
    //     next(error);
    // }
}

const updateMenu = async (req, res, next) => {
    // try {
    //     const { header, footer } = req.body;

    //     if (header) {
    //         file.header = header;
    //     }

    //     if (footer) {
    //         file.footer = footer;
    //     }

    //     fs.writeFileSync(filePath, JSON.stringify(file, null, 2));
    //     res.status(StatusCodes.OK).json({ message: 'Cập nhật menu thành công !' });
    // } catch (error) {
    //     next(error);
    // }
}

export const menuController = {
    allMenu,
    updateMenu
}
