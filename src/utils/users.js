const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (username && room) {
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
        user.push(user)
        return { user }
    } else return {
        error: 'Username and room required!'
    }

}

const removeUser = () => {

}

const getUser = () => {

}

const getUsersInRoom = () => {

}