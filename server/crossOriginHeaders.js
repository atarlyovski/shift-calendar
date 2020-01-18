exports.crossOriginHeaders = function() {
    return async function(ctx, next) {
        ctx.response.set({
            "Access-Control-Allow-Credentials": true
        });

        await next();
    }
}