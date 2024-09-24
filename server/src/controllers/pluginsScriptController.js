import { StatusCodes } from "http-status-codes";
import pluginsScriptModel from "~/models/pluginsScriptModel";

const addPluginsScript = async (req, res, next) => {
    try {
        const { scripts, styles } = req.body;

        // Tìm các script đã tồn tại trong MongoDB
        const existingScripts = await pluginsScriptModel.find({
            scripts: { $in: scripts }
        });

        // Lọc ra các script chưa tồn tại
        const newScripts = scripts.filter(script =>
            !existingScripts.some(existingScript => existingScript.scripts.includes(script))
        );

        // Tìm các style đã tồn tại trong MongoDB
        const existingStyles = await pluginsScriptModel.find({
            styles: { $in: styles }
        });

        // Lọc ra các style chưa tồn tại
        const newStyles = styles.filter(style =>
            !existingStyles.some(existingStyle => existingStyle.styles.includes(style))
        );

        // Nếu có script hoặc style mới, cập nhật vào MongoDB
        if (newScripts.length > 0 || newStyles.length > 0) {
            await pluginsScriptModel.updateOne(
                {},
                { $addToSet: { scripts: { $each: newScripts }, styles: { $each: newStyles } } },
                { upsert: true } // Nếu document không tồn tại, thì tạo mới
            );
        }

        res.status(StatusCodes.CREATED).json({ newScripts, newStyles });
    } catch (error) {
        next(error);
    }
}

const allPluginsScript = async (req, res, next) => {
    try {
        const allCategory = await pluginsScriptModel.find({}).sort({ createdAt: -1 });
        res.status(StatusCodes.CREATED).json(allCategory);
    } catch (error) {
        next(error);
    }
}

const delPluginsScript = async (req, res, next) => {
    try {
        const { scripts, styles } = req.body;
        if (scripts && scripts.length > 0) {
            await pluginsScriptModel.updateOne(
                {},
                { $pull: { scripts: { $in: scripts } } }
            );
        }
        if (styles && styles.length > 0) {
            await pluginsScriptModel.updateOne(
                {},
                { $pull: { styles: { $in: styles } } }
            );
        }
        res.status(StatusCodes.OK).json({ message: "Scripts and styles deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export const pluginsScriptController = {
    addPluginsScript,
    allPluginsScript,
    delPluginsScript,
}