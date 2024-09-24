import { WHITELIST_DOMAINS } from '../utils/constants.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

export const corsOptions = {
    origin: function (origin, callback, req, res) {
        if (!origin && process.env.BUILD_MODE === 'dev') {
            return callback(null, true)
        }

        if (WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true)
        }
        return callback(new ApiError(StatusCodes.FORBIDDEN, `ARIS-3D not allowed by our CORS Policy.`))
    },
    optionsSuccessStatus: 200,
    credentials: true
}