
import { io } from 'socket.io-client';

const socket = io.connect('https://wetalk-6y44.onrender.com/');

export default socket;