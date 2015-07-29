//Hack.chat bot by Jax
//TODO ok, this file is getting way to big...I need to break it up somehow

var ChatConnection = require("./chatConnection.js");
var config = require("./config.json");
var lightsOut = require("./lightsOut.js");
var help = require("./help.js");

commands = {};

//websocket connection to hack.chat
var chatConnection = new ChatConnection(config.url, config.nickname, config.channel);

for(var subCommandKey in lightsOut) {
	if(typeof lightsOut[subCommandKey] == "object") {
		commands[subCommandKey] = lightsOut[subCommandKey];
	}
}
commands["help"] = help;

//called whenever a message is sent through the chat
var parseMessage = function(data) {
    //if message doesnt begin with the trigger
	if(data.text.indexOf(config.trigger) != 0) {
		return;
	}
	data.arguments = data.text.split(" ");
	command = data.arguments[0].substring(config.trigger.length, data.arguments[0].length);
	data.arguments.splice(0, 1); //remove command from argument
	data.argText = data.arguments.join(" "); //full message text without command
	
    //loop through all command names(keys)
	for(var key in commands) {
		if(key == command) {
			console.log(data.nick + ": " + key);
			try{
			commands[key].eval(data, chatConnection, commands, config);
			} catch(exception) {
				chatConnection.sendMessage("Exception: " + exception.message);
				console.log(exception.stack);
			}
			break;
		}
	}
}

chatConnection.on("chat", function(data) {
		parseMessage(data, false);
});