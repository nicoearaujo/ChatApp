const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const { genMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')




const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    socket.on('joined', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            callback(error)
        } else {
            socket.join(room)

            socket.emit('message', genMessage('Welcome', 'Admin'))
            socket.broadcast.to(user.room).emit('message', genMessage(`${user.username} has joined!`, 'Admin'))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })

            callback()
        }
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', genMessage(msg, user.username))
        callback('Delivered')
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', genMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', genMessage(`${user.username} has left the room!`, 'Admin'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port)