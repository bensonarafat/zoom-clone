const  socket  = io("/")

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs', 
    host: "/",
    port: '3000'
}); 

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true,
}).then((stream) => {
    myVideoStream = stream
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
    });
})


peer.on('open', id => {
    socket.emit("join-room", ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video') 
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoGrid.append(video)
}


let msg = document.getElementById("chat_message");
document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if(e.key == "Enter" && msg.value != ""){
        console.log(msg.value);
        socket.emit("message", msg.value);
        msg.value = "";
    }
   
});


socket.on("createMessage", message => {
    let messages = document.getElementById("messages");
    const li = document.createElement("li");
    const b = document.createElement("b");
    const br = document.createElement("br");
    b.append("user");
    messages.append(li)
    li.prepend(b)
    li.append(br, message);
    scrollToBottom();
});


const scrollToBottom = () => {
    let mainChatWindow = document.getElementsByClassName("main__chat_window");
    let child = mainChatWindow[0]; 
    child.scrollTop = child.scrollHeight;
}

//mute our video 
const muteUnmute = () => {
    const enable = myVideoStream.getAudioTracks()[0].enable;
    if(enable){
        myVideoStream.getAudioTracks()[0].enable = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enable = true;
    }
}

const setMuteButton = () => {
    const html = `
    <img src="/icon/mic-off.svg" alt="" srcset="">
    <span>Mute</span>
    `;

    document.querySelector(".main__mute_button").innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <img src="/icon/mic.svg" alt="" srcset="">
    <span>Mute</span>
    `;

    document.querySelector(".main__mute_button").innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = () => {
    const html = `
    <img src="/icon/video-off.svg" alt="" srcset="">
    <span>Start Video</span>
    `;

    document.querySelector(".main_video_button").innerHTML = html;
}

const setStopVideo = () => {
    const html = `
    <img src="/icon/video.svg" alt="" srcset="">
    <span>Stop Video</span>
    `;

    document.querySelector(".main_video_button").innerHTML = html;
}