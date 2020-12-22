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
		Streamhannelid: String,
		Streampoststyle: String,
		Streamfeeds: Array<String>,
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
		Streamhannelid: String,
		Streampoststyle: String,
		Streamfeeds: [String],
	},
});

const Server = Mongoose.model('Server', serverSchema);

export default Server;
