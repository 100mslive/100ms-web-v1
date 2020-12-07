const options = {
    'displayname': 'nimishkhurana',
    'logoSrc' : 'https://julianrossdunn.files.wordpress.com/2013/03/url.jpeg?w=808'
}
const hmsIframe = new HMSIframe(options);

document.getElementById("leave-button").addEventListener('click', () => {
    hmsIframe.leave();
});

function handleConnect(data) {
    console.log('createIframe: ', data);
    document.getElementById("notifications").innerHTML = data;
}

hmsIframe.on('room-create', handleConnect);

