const genMessage = (text, username) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    genMessage
}