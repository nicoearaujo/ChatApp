const socket = io()

const msgForm = document.querySelector('#msgForm')
const msgInput = msgForm.querySelector('input')
const msgButton = msgForm.querySelector('button')
const messages = document.querySelector('#messages')
const locationButton = document.querySelector('#sendlocation')
const sidebar = document.querySelector('#sidebar')

const messageTemplate = document.querySelector('#messageTemplate').innerHTML
const locationTemplate = document.querySelector('#locationTemplate').innerHTML
const sidebarTemplate = document.querySelector('#sidebarTemplate').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    const newMessage = messages.lastElementChild

    const newMessageMargin = parseInt(getComputedStyle(newMessage).marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visisbleHeight = messages.offsetHeight

    const contentHeight = messages.scrollHeight

    const scrollOffset = messages.scrollTop + visisbleHeight

    if (Math.round(contentHeight - newMessageHeight) <= Math.round(scrollOffset)) {
        messages.scrollTop = messages.scrollHeight
    }
}


socket.on('message', (msg) => {
    console.log(username)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('HH:mm'),
        username: msg.username
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


socket.on('locationMessage', (msg) => {
    const html = Mustache.render(locationTemplate, {
        url: msg.text,
        createdAt: moment(msg.createdAt).format('HH:mm'),
        username: msg.username
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    msgButton.setAttribute('disabled', 'disabled')
    const msg = e.target.elements.msgUser.value
    socket.emit('sendMessage', msg, (msg) => {
        console.log(msg)
        msgInput.value = ''
        msgInput.focus()
        msgButton.removeAttribute('disabled')
    })
})

locationButton.addEventListener('click', () => {
    locationButton.setAttribute('disabled', 'disabled')
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, () => {
                console.log('Location shared')
                locationButton.removeAttribute('disabled')
            })
        })
    } else alert('Geolocation is not supported by your browser!')
})

socket.emit('joined', {
    username,
    room
}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})