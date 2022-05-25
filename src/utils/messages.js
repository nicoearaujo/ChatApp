const genMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genMessage
}