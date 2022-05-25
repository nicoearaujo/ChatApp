const users = []

const addUser = ({ id, username, room }) => {

    if (username && room) {
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        //Check if user exists
        const exisitingUser = users.find((user) => {
            return user.room === room && user.username === username
        })
        if (exisitingUser) {
            return {
                error: 'Username already used!'
            }
        }

        const user = { id, username, room }
        users.push(user)
        return { user }
    } else return {
        error: 'Username and room required!'
    }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index >= 0) {
        return users.splice(index, 1)[0]
    } else return {
        error: 'User not found!'
    }
}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    if (!user) {
        return { error: 'User doesnt exist' }
    }
    return user
}

const getUsersInRoom = (room) => {
    return users.filter((user) => {
        return user.room === room.toLowerCase()
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}