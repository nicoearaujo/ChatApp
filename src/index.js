const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const { genMessage } = require('./utils/messages')




const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    socket.on('joined', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', genMessage('Welcome'))
        socket.broadcast.to(room).emit('message', genMessage(`${username} has joined!`))
    })

    socket.on('sendMessage', (msg, callback) => {
        io.emit('message', genMessage(msg))
        callback('Delivered')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', genMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', genMessage('A user has left'))
    })
})

server.listen(port)