import orderModel from "~/models/orderModel";
import { addData, deleteData, getData } from "./indexControllder";
import { StatusCodes } from "http-status-codes";
import userModel from "~/models/userModel";

const nameMess = 'Đơn hàng';

const addOrder = async (req, res, next) => {
    try {
        const result = await addData(nameMess, orderModel, req.body, {
            uniqueField: 'orderId',
        });
        res.status(result.status).json({ message: result.message, newData: result.data });
    } catch (error) {
        next(error);
    }
}

const allOrder = async (req, res, next) => {
    try {
        const results = await getData(nameMess, orderModel, {
            sort: { createdAt: -1 },
        });
        res.status(results.status).json(results.message);
    } catch (error) {
        next(error);
    }
}

const sigOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await orderModel.find({ idUser: id });
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

const delOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteData(nameMess, orderModel, id);
        res.status(result.status).json({ message: result.message, _id: id });
    } catch (error) {
        next(error);
    }
}

const putOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newData = await orderModel.findOneAndUpdate({ orderId: id }, req.body, { new: true });
        res.status(StatusCodes.OK).json(newData);
    } catch (error) {
        next(error);
    }
}

const revenue = async (req, res, next) => {
    const calculateTotalRevenue = async (startDate, endDate) => {
        const orders = await orderModel.find({
            status: true,
            updatedAt: { $gte: startDate, $lte: endDate }
        });

        const totalRevenue = orders.reduce((total, order) => {
            const orderTotal = order.product.reduce((sum, product) => sum + product.price * product.quantity, 0);
            return total + orderTotal;
        }, 0);

        return totalRevenue;
    };

    const calculateTotalOrders = async (startDate, endDate) => {
        const orders = await orderModel.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });
        return orders.length;
    };

    const calculateTotalOrdersWithStatus = async (startDate, endDate, status = true) => {
        const orders = await orderModel.find({
            status,
            createdAt: { $gte: startDate, $lte: endDate }
        });
        return orders.length;
    };

    const calculateTotalUsers = async (startDate, endDate) => {
        const users = await userModel.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });
        return users.length;
    };

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set thời gian bắt đầu của ngày hôm nay

        const startOfToday = new Date(today);
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999); // Set thời gian kết thúc của ngày hôm nay

        // Tổng doanh thu tất cả hóa đơn có trạng thái là status = true
        const totalRevenueAllTime = await calculateTotalRevenue(new Date(0), new Date());

        // Weekly Revenue
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday of this week
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // Saturday of this week
        endOfWeek.setHours(23, 59, 59, 999);
        const weeklyRevenue = await calculateTotalRevenue(startOfWeek, endOfWeek);

        // Previous Week Revenue
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7); // Start of last week
        const endOfLastWeek = new Date(endOfWeek);
        endOfLastWeek.setDate(endOfWeek.getDate() - 7); // End of last week
        const lastWeekRevenue = await calculateTotalRevenue(startOfLastWeek, endOfLastWeek);

        // Calculate the revenue difference between weeks
        const revenueDifference = weeklyRevenue - lastWeekRevenue;

        // Tổng doanh thu của từng tháng (tháng 1 - tháng 12)
        const monthlyRevenues = [];
        for (let month = 0; month < 12; month++) {
            const startOfMonth = new Date(today.getFullYear(), month, 1);
            const endOfMonth = new Date(today.getFullYear(), month + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            const monthlyRevenue = await calculateTotalRevenue(startOfMonth, endOfMonth);
            monthlyRevenues.push({
                month: month + 1,
                revenue: monthlyRevenue
            });
        }

        // Weekly Orders and Status = true Orders
        const totalOrdersThisWeek = await calculateTotalOrders(startOfWeek, endOfWeek);
        const totalOrdersThisWeekWithStatus = await calculateTotalOrdersWithStatus(startOfWeek, endOfWeek);

        // Previous Week Orders
        const totalOrdersLastWeek = await calculateTotalOrders(startOfLastWeek, endOfLastWeek);
        const totalOrdersLastWeekWithStatus = await calculateTotalOrdersWithStatus(startOfLastWeek, endOfLastWeek);

        // Order Difference Between Weeks
        const orderDifferenceWithStatus = totalOrdersThisWeekWithStatus - totalOrdersLastWeekWithStatus;

        // Total Orders with Status = true
        const totalOrdersWithStatus = await calculateTotalOrdersWithStatus(new Date(0), new Date());

        // Calculate daily revenues for this week
        const dailyRevenues = [];
        for (let i = 0; i <= today.getDay(); i++) {
            const startOfDay = new Date(startOfWeek);
            startOfDay.setDate(startOfWeek.getDate() + i);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            const dailyRevenue = await calculateTotalRevenue(startOfDay, endOfDay);
            dailyRevenues.push({
                day: startOfDay.toLocaleDateString(),
                revenue: dailyRevenue
            });
        }

        // Calculate total users for this week
        const totalUsersThisWeek = await calculateTotalUsers(startOfWeek, endOfWeek);

        // Calculate total users and the difference with the previous week
        const totalUsersWithStatus = await calculateTotalUsers(new Date(0), new Date());

        const startOfLastWeekUsers = new Date(startOfLastWeek);
        startOfLastWeekUsers.setHours(0, 0, 0, 0);
        const endOfLastWeekUsers = new Date(endOfLastWeek);
        endOfLastWeekUsers.setHours(23, 59, 59, 999);

        const totalUsersLastWeek = await calculateTotalUsers(startOfLastWeekUsers, endOfLastWeekUsers);
        const userDifference = totalUsersThisWeek - totalUsersLastWeek;

        // Đếm đơn hàng status = false trong hôm nay
        const totalOrdersTodayWithFalseStatus = await calculateTotalOrdersWithStatus(startOfToday, endOfToday, false);

        // Tổng số đơn hàng đã tạo trong hôm nay
        const totalOrdersToday = await calculateTotalOrders(startOfToday, endOfToday);

        // Tổng số đơn hàng có status = true trong hôm nay
        const totalOrdersTodayWithTrueStatus = await calculateTotalOrdersWithStatus(startOfToday, endOfToday, true);

        res.status(200).json({
            revenue: {
                totalRevenueAllTime,  // Tổng doanh thu tất cả hóa đơn status = true
                weeklyRevenue,
                dailyRevenues,
                revenueDifference,  // Chênh lệch doanh thu tuần này so với tuần trước
                monthlyRevenues,    // Tổng doanh thu theo tháng từ tháng 1 đến tháng 12
            },
            orders: {
                totalOrdersThisWeekWithStatus,
                orderDifferenceWithStatus,
                totalOrdersWithStatus,
                totalOrdersToday,  // Tổng số đơn hàng đã tạo trong hôm nay
                totalOrdersTodayWithFalseStatus, // Đơn hàng status = false trong hôm nay
                totalOrdersTodayWithTrueStatus,  // Đơn hàng status = true trong hôm nay
            },
            users: {
                totalUsersThisWeek,
                totalUsersWithStatus,
                userDifference
            }
        });
    } catch (error) {
        next(error);
    }
};

export const orderController = {
    addOrder,
    allOrder,
    delOrder,
    putOrder,
    sigOrder,
    revenue
}
