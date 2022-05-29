const chatId = document.getElementById('chatId').value;
const friendDataId = document.getElementById('friendDataId').value;
const friendDataImage = document.getElementById('friendDataImage').value;
const friendDataName = document.getElementById('friendDataName').value;
const myDataImage = document.getElementById('myDataImage').value;
const myDataName = document.getElementById('myDataName').value;


const msg = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const msgContainter = document.getElementById('messages-container');
const callBtn = document.getElementById('callBtn');



socket.emit('joinChat', chatId);

sendBtn.onclick = () => {
    
    let content = msg.value;
    let date = new Date()
    
    socket.emit('sendMessage', {
        chat: chatId,
        content: content,
        sender: myId,
        timestamp: date.toLocaleTimeString().slice(0,5)

    }, () => {
        msg.value = ''
    });
}

socket.on('newMessage', (msg) => {
    // msgContainter.innerHTML += msg.content
    
    let messagesList = document.getElementById('messages-list');
    let lastMsg = document.getElementById('last-msg');
    let lastMsgTime = document.getElementById('last-msg-time');
    
    lastMsgTime.innerHTML = `
        ${msg.timestamp}
    `

    lastMsg.innerHTML = `
        ${msg.content}
    `
    if (msg.sender === friendDataId) {
        messagesList.innerHTML += `
            <li class="d-flex justify-content-between mb-4">
                <img src="/${friendDataImage}" alt="avatar"
                    class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60">
                <div class="card w-100">
                    <div class="card-header d-flex justify-content-between p-3">
                        <p class="fw-bold mb-0">
                            ${friendDataName}
                        </p>
                        <p class="text-muted small mb-0"><i class="far fa-clock"></i>
                            ${msg.timestamp}
                        </p>
                    </div>
                    <div class="card-body" id="messages-container">
                                
                        <p class="mb-0"></p>
                            ${msg.content}
                        </p>
        
                    </div>
                </div>
            </li>
        `
    } else {
        messagesList.innerHTML += `
            <li class="d-flex justify-content-between mb-4">
                <div class="card w-100">
                    <div class="card-header d-flex justify-content-between p-3">
                        <p class="fw-bold mb-0">
                            ${myDataName}
                        </p>
                        <p class="text-muted small mb-0"><i class="far fa-clock"></i>
                            ${msg.timestamp}
                        </p>
                    </div>
                    <div class="card-body">
                        
                        <p class="mb-0"></p>
                            ${msg.content}
                        </p>
                                    
                    </div>
                </div>
                <img src="/${myDataImage}" alt="avatar" class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                    width="60">
            </li>
        `
    }
    // if (messages.length === 0) {
    //     messagesList.innerHTML += `
    //         <p class="alert alert-danger">
    //               No Messages                                      
    //         </p>
    //     `
    // } else {

    //     for (let message of messages) {
    
    //     }
    // }
    // messagesList.innerHTML += `

    // `
});

let peer = new Peer();
let peerId = null;

peer.on('open', id => {
    console.log('my Id', id);
    peerId = id;
});

callBtn.onclick = () => {
    socket.emit('requestPeerId', chatId);
};

socket.on('getPeerId', () => {
    socket.emit('sendPeerId', {
        chatId: chatId,
        peerId: peerId
    })
});

socket.on('recievePeerId', id => {
    navigator.mediaDevices.getUserMedia({
        video: true, audio: true
    }).then(stream => {
        let call = peer.call(id, stream);
        call.on('stream', showVideoCall)
    }).catch(err => {
        console.log(err);
    })
});

peer.on('call', call => {
    navigator.mediaDevices.getUserMedia({
        video: true, audio: true
    }).then(stream => {
        call.answer(stream);
        call.on('stream', showVideoCall)
    }).catch(err => {
        console.log(err);
    })
});

function showVideoCall(stream) {
    let video = document.createElement('video');
    video.srcObject = stream;
    document.body.append(video);
    video.play();
}