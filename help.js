help = {};

help.eval = function(data, chatConnection, commands, config) {
	if(data.arguments.length == 0) {
        commandList = "";
        for(var key in commands) {
            if(!commands[key].hidden) { //if command is not hidden
		      commandList += config.trigger + key + ", ";
            }
        }
	   chatConnection.sendMessage("$\\large \\color{#3399FF}{Lights\\ Out\\ game\\ bot}$By @Jax\nMore info about Lights Out can be found here: https://en.wikipedia.org/wiki/Lights_Out_(game) \n" + 
	    "Source for this bot can be found on github: https://github.com/JaxForReal/lights-out-bot\n\n" +
		"(Use help <command name> to get info on a specific command)\nAll commands start with " + config.trigger + "\n\n" + commandList);
        return;
	}
	if(commands[data.arguments[0]] != null) {
	   chatConnection.sendMessage(commands[data.arguments[0]].help);
	} else {
		chatConnection.sendMessage("unknown command: " + data.arguments[0]);
	}
}
help.help = "Usage: help <command>\nDisplays information and usage about a command.";

module.exports = help;