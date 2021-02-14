/*
Discord Server data shit
*/
import Mongoose, { Schema } from 'mongoose';

interface Iserver {
	_id: String;
	ServerName: String;
	Settings: {
		Prefix: String;
		Welcomemessage: String;
		Adminroles: Array<any>;
		Moderatorroles: Array<any>;
	};
	Twitter: {
		Blockretweets: Boolean;
		Blockreplies: Boolean;
		Feeds: [
			{
				TwitterHandle: String;
				DiscordChannelId: String;
			}
		];
	};
	Streams: {
		Streamchannelid: String,
		Streampoststyle: String, //Not useable currently
		Streamfeeds: Array<String>,
		Deletemessage: Boolean,
		Pingrole: String,
	};
}

const serverSchema: Iserver | Schema = new Schema({
	_id: String,
	ServerName: String,
	Settings: {
		Prefix: String,
		Welcomemessage: String,
		Adminroles: [],
		Moderatorroles: [],
	},
	Twitter: {
		Blockretweets: Boolean,
		Blockreplies: Boolean,
		Feeds: [
			{
				TwitterHandle: String,
				DiscordChannelId: String,
			},
		],
	},
	Streams: {
		Streamchannelid: String,
		Streampoststyle: String,
		Streamfeeds: [],
		Deletemessage: Boolean,
		Pingrole: String,
	},
});

const Server = Mongoose.model('Server', serverSchema);

export default Server;
