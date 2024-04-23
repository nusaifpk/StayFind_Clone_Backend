const tryCatchMiddleware = (tryCatchHandler) => {
    return async(req,res,next) => {
        try {
            await tryCatchHandler(req,res,next)
        } catch (error) {
            console.log(error)
            res.json({
                status:"error",
                message: error.message
            })
        }
    }
}

export default tryCatchMiddleware