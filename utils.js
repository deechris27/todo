// Util function to generate

module.exports = function generateToken(jwt, req, tokenType) {
    const pointy_boss = {
        username: req.body.username || 'Pointyhairboss'
    };
    if (tokenType === "access") {
        return jwt.sign({ pointy_boss }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
    }
    if (tokenType === "refresh") {
        return jwt.sign({ pointy_boss }, process.env.REFRESH_TOKEN_SECRET);
    }
}