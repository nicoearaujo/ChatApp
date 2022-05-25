const socket = io()

const msgForm = document.querySelector('#msgForm')
const msgInput = msgForm.querySelector('input')
const msgButton = msgForm.querySelector('button')
const messages = document.querySelector('#messages')
const locationButton = document.querySelector('#sendlocation')

const messageTemplate = document.querySelector('#messageTemplate').innerHTML
const locationTemplate = document.querySelector('#locationTemplate').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (msg) => {
    console.log(msg.text)
    const html = Mustache.render(messageTemplate, {
        message: msg.text,
        createdAt: moment(msg.createdAt).format('HH:mm')
    })
    messages.insertAdjacentHTML('beforeend', html)
})


socket.on('locationMessage', (msg) => {
    const html = Mustache.render(locationTemplate, {
        url: msg.text,
        createdAt: moment(msg.createdAt).format('HH:mm')
    })
    messages.insertAdjacentHTML('beforeend', html)
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
})