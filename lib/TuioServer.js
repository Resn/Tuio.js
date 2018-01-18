module.exports = (function() {
	return function() {
		var dgram = require("dgram"),
			udpSocket = null,
			socketio = require("socket.io"),
			io = null,
			oscParser = require("./OscParser")
			
			init = function (params) {
				
				var io = socketio(params.server);
			
				udpSocket = dgram.createSocket("udp4");
				udpSocket.on("listening", onSocketListening);
				udpSocket.bind(params.oscPort, params.oscHost);
				
				io.sockets.on("connection", onSocketConnection);
			},
			
			onSocketListening = function () {
				var address = udpSocket.address();
				console.log("TuioServer listening on: " + address.address + ":" + address.port);
			},
			
			onSocketConnection = function (socket) {
				udpSocket.on("message", function (msg) {
					socket.emit("osc", oscParser.decode(msg));
				});
			};
		
		return {
			init: init
		};
	}
}());