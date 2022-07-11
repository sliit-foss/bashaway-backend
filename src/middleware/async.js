import logger from "../utils/logger";

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch((err) => {
            logger.error(`Error: ${err.message} | Stack: ${err.stack}`);
            next();
        });
}

export default asyncHandler;