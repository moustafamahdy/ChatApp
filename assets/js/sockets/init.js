const socket = io()

const btn = document.getElementById('friendRequestsDropdown');
let myId = document.getElementById('userId').value;

socket.on('connect', () => {
    // console.log('Connected')
    socket.emit('joinNotificationsRoom', myId);
    socket.emit('goOnline', myId);

})

socket.on('newFriendRequest', data => {
    // console.log(data);
    const friendRequests = document.getElementById('friendRequests');
    const span = friendRequests.querySelector('span');
    if (span) span.remove();
    friendRequests.innerHTML += `
    <a class="dropdown-item" href="/profile/${data.id}">
        ${data.name}
    </a>`;
    
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-danger');
})

document.getElementById('friendRequestsDropdown').onclick = () => {
    btn.classList.remove('btn-danger');
    btn.classList.add('btn-primary');
}