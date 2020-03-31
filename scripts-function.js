const contenedorVideo = document.querySelector('.video-container');
const video = contenedorVideo.querySelector('video');
const canvas = contenedorVideo.querySelector('canvas.photo');
const contexto = canvas.getContext('2d');
const album = document.querySelector('section.album');
const sonidos = document.querySelector('audio.snap');
const tomarFotos = contenedorVideo.querySelector('button.photo-taker');

function solicitarVideoAlNavegador() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(localMediaStream){
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
            agregarEventos();
        })
        .catch(function(error){
            console.error('Pasaron cosas', error);
        });
}

function tomarFoto() {
    sonidos.currentTime = 0;
    sonidos.play();

    const photoUrl = canvas.toDataURL('image/jpeg');

    const link = document.createElement('a');
    link.href = photoUrl;
    link.setAttribute('download', 'foto');
    link.innerHTML = `<img src="${photoUrl}" alt="Una foto" />`;
    album.insertBefore(link, album.firstChild);
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function mostrarVideoEnCanvas() {
    const width = contenedorVideo.getBoundingClientRect().width;
    const height = (video.videoHeight * width) / video.videoWidth;
    canvas.width = width;
    canvas.height = height;

    setInterval(function() {
        contexto.drawImage(video, 0, 0, width, height);
        
        let pixels = contexto.getImageData(0, 0, width, height);
        
        //pixels = rgbSplit(pixels);
        
        contexto.putImageData(pixels, 0, 0);
    }, 1);
}

function agregarEventos() {
    tomarFotos.addEventListener('click', tomarFoto);
    video.addEventListener('canplay', mostrarVideoEnCanvas);
}

solicitarVideoAlNavegador();