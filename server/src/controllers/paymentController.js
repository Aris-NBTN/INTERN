import { StatusCodes } from "http-status-codes";
import axios from 'axios';
import crypto from 'crypto';

import fs from 'fs';
import path from 'path';

// Zalopay
import moment from 'moment';
import CryptoJS from 'crypto-js';

// VNPay
// import config from 'config';
// import dateFormat from 'dateformat';
import querystring from 'qs';

// VietQR
import PayOS from '@payos/node';

import { BaseClient, BaseServer } from '~/utils/constants';

// const filePath = path.resolve(__dirname, '../json/info.json');

var YOUR_CLIENT_ID = '7de09ded-b671-4cdd-9c7c-ee56416f15be';
var YOUR_API_KEY = '8195937f-acc1-4fa5-b6ed-e8f3bafb9f7e';
var YOUR_CHECKSUM_KEY = 'dad2de38dff40c99344ce28ca6a0ae7950bbd5fa8d7e88082f701d139e78fb37';

const payOS = new PayOS(
    YOUR_CLIENT_ID,
    YOUR_API_KEY,
    YOUR_CHECKSUM_KEY
);

const payWithMoMo = async (req, res, next) => {
    // const { amount, orderInfo } = req.body;

    // var amount = '50000';
    // var orderInfo = 'pay with MoMo';

    // var accessKey = 'F8BBA842ECF85';
    // var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

    // var partnerCode = 'MOMO';

    // var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    // var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

    // var requestType = "payWithMethod";

    // var orderId = partnerCode + new Date().getTime();
    // var requestId = orderId;
    // var extraData = '';
    // var orderGroupId = '';
    // var autoCapture = true;
    // var orderExpireTime = 1;
    // var lang = 'vi';

    // var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    // console.log("--------------------RAW SIGNATURE----------------")
    // console.log(rawSignature)
    // //signature

    // var signature = crypto.createHmac('sha256', secretKey)
    //     .update(rawSignature)
    //     .digest('hex');
    // console.log("--------------------SIGNATURE----------------")
    // console.log(signature)

    // //json object send to MoMo endpoint
    // const requestBody = JSON.stringify({
    //     partnerCode: partnerCode,
    //     partnerName: "Test",
    //     storeId: "MomoTestStore",
    //     requestId: requestId,
    //     amount: amount,
    //     orderId: orderId,
    //     orderInfo: orderInfo,
    //     redirectUrl: redirectUrl,
    //     ipnUrl: ipnUrl,
    //     lang: lang,
    //     requestType: requestType,
    //     autoCapture: autoCapture,
    //     orderExpireTime: orderExpireTime,
    //     extraData: extraData,
    //     orderGroupId: orderGroupId,
    //     signature: signature
    // });

    // // Call api
    // const options = {
    //     method: "POST",
    //     url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Content-Length': Buffer.byteLength(requestBody)
    //     },
    //     data: requestBody
    // }

    // try {
    //     let result = await axios(options);
    //     return res.status(StatusCodes.CREATED).json(result.data);

    // } catch (error) {
    //     next(error);
    // }
}

const payWithZaloPay = async (req, res, next) => {
    // const config = {
    //     app_id: "2553",
    //     key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    //     key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    //     endpoint: "https://sb-openapi.zalopay.vn/v2/create"
    // };

    // const embed_data = {
    //     redirecturl: "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",
    // };

    // const items = [{

    // }];

    // const transID = Math.floor(Math.random() * 1000000);
    // const order = {
    //     app_id: config.app_id,
    //     app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
    //     app_user: "user123",
    //     app_time: Date.now(),
    //     item: JSON.stringify(items),
    //     embed_data: JSON.stringify(embed_data),
    //     amount: 50000,
    //     description: `Lazada - Payment for the order #${transID}`,
    //     bank_code: "",
    // };

    // const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    // order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    // try {
    //     axios.post(config.endpoint, null, { params: order })
    //         .then(res => {
    //             console.log(res.data);
    //         })
    //         .catch(err => console.log(err));

    //     return res.status(StatusCodes.CREATED).json("OK");
    // } catch (error) {
    //     next(error);
    // }
}

const payWithVNPay = async (req, res, next) => {
    // try {
    //     return res.status(StatusCodes.CREATED).json("OK");
    // } catch (error) {
    //     next(error);
    // }
}

const createQRPayment = async (req, res, next) => {
    // {
    //     "BANKID": "970422",
    //     "ACCOUNT": "0918685740",
    //     "PRICE": "1000",
    //     "DESCRIPTION": "HAHA"
    // }
    const { BANKID, ACCOUNT, PRICE, DESCRIPTION } = req.body;
    const QuickLink = `https://img.vietqr.io/image/${BANKID}-${ACCOUNT}-compact2.png?amount=${PRICE}&addInfo=${DESCRIPTION}`
    try {
        return res.status(StatusCodes.CREATED).json(QuickLink);
    } catch (error) {
        next(error);
    }
}

const testPayment = async (req, res, next) => {
    const { id, product, total } = req.body;

    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ message: "ERROR ID" });
    if (!product) return res.status(StatusCodes.BAD_REQUEST).json({ message: "ERROR PRODUCT" });
    if (!total) return res.status(StatusCodes.BAD_REQUEST).json({ message: "ERROR TOTAL" });

    const body = {
        orderCode: id,
        amount: total,
        items: product,
        description: "Thanh toan don hang",
        returnUrl: `${BaseClient}/success`,
        cancelUrl: `${BaseClient}/cancel`,
    };

    try {
        const paymentLinkResponse = await payOS.createPaymentLink(body);
        return res.status(StatusCodes.CREATED).json({ url: paymentLinkResponse.checkoutUrl });
    } catch (error) {
        next(error);
    }
}

const checkPayment = async (req, res, next) => {
    const webhookData = payOS.verifyPaymentWebhookData(req.body);
    res.status(StatusCodes.OK).json(webhookData);

    if (code == '00') {
        const updateOrder = { status: true, paymentMethod: 'Chuyển Khoản Ngân Hàng' }
        try {
            const response = await axios.put(`${BaseServer}/v1/order/${webhookData.orderCode}`, updateOrder);
            const products = response.data.product;
            const productIds = products.map(product => product.id);
            const updateUser = await axios.put(`${BaseServer}/v1/user/course/${response.data.idUser}`, { courses: productIds });
            return res.status(StatusCodes.OK).json(updateUser);
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không có khóa học nào được cập nhập" });
        }
    } else {
        return res.status(StatusCodes.OK).json({ message: "OK" });
    }
}

export const paymentController = {
    payWithMoMo,
    payWithZaloPay,
    payWithVNPay,
    createQRPayment,
    testPayment,
    checkPayment
}