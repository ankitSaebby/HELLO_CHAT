const socket = io('/');

const videoGrid=document.getElementById('video-grid');

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})

let myVideoStream;
const myVideo = document.createElement('video');
myVideo.muted=false;
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const Video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(Video,userVideoStream)
        })
    })

    socket.on('user-connected', userId =>{
        connectToNewUser(userId, stream);
    })

    let msg = $('input');
    //console.log(msg);

    $('html').keydown(function (e) {
        if (e.which == 13 && msg.val().length !== 0) {
            console.log(msg.val());
        socket.emit('message', msg.val());
        msg.val('')
        }
    });

    socket.on('create-message', message =>{
        $('.messages').append(`<li class="message"><b>User</b><br>${message}</li>`)
        scrollToBottom();
    })

    socket.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
      })
        
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});



function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })

    call.on('close', () => {
        video.remove()
      })
    
      peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
}

const scrollToBottom =() =>{
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

// MUTE VIDEO

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }

  // STOP VIDEO 

  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }