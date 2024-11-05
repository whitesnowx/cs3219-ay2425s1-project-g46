// socketHandler.js
const io = require('socket.io')(process.env.PORT); // Change the port as needed

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('initiateCall', (data) => {
        const { from, to } = data;
        // Emit the call event to the receiving user
        socket.to(to).emit('callReceived', { from: from });
    });

    socket.on('endCall', (data) => {
        const { to } = data;
        socket.to(to).emit('callEnded');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

module.exports = io;
