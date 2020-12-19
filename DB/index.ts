import Mongoose from 'mongoose';
import { exit } from 'process';
import Server from './serversSchema';

class DB {
	constructor(dburl: string) {
		try {
			console.log('Attempting to connect to the database');
			Mongoose.connect(dburl, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				autoIndex: false,
			});
		} catch (error) {
			throw new Error(
				'Database Connection failed. Please check your configuration'
			);
			exit;
		}
	}

	async getServerConfig(serverid) {
		const serverconf = await Server.findById(serverid)
			.then((response) => {
				if (response === null)
					throw new Error(`Server not found in Database`);
				return response;
			})
			.catch((error) => {
				throw Error(error);
			});

		return serverconf;
	}

	async getAllServerConfigs() {
		const configs = await Server.find({}).exec();

		return configs;
	}

	async createNewServerConfig(serverId, serverName) {
		const newServerDetails = new Server({
			_id: serverId,
			ServerName: serverName,
			Settings: {
				Prefix: '!',
				Welcomemessage: '',
				Adminroles: [],
				Moderatorroles: [],
			},
			Twitter: {
				Blockretweets: false,
				Blockreplies: false,
				Feeds: [],
			},
		});

		await newServerDetails.save();
	}

	async setNewSetting(serverId, setting, newValue: any) {
		// First get the server based on the server id, so we can change the config required
		const serverConfig: any = await Server.findById(serverId);
		const formattedSettingName = [
			setting[0].toUpperCase(),
			...setting.slice(1),
		].join('');

		// the below If statement should check if the 'setting' that was passed actually exists in 'serverConfig' then process changes to the config
		if (serverConfig.Settings[formattedSettingName]) {
			console.log(
				`Updating Server Config ${serverId} with setting change: ${setting}`
			);

			serverConfig.Settings[formattedSettingName] = newValue[0];

			serverConfig.save();
		}
	}

	async setAdminRoles(serverId, action, newValue: any) {
		// First get the server based on the server id, so we can change the config required
		const serverConfig: any = await Server.findById(serverId);

		if (action === 'add') {
			console.log(
				`Adding role ${newValue} in Admin list for Server: ${serverId}`
			);
			serverConfig.Settings.Adminroles.push(newValue);
		} else if (action === 'remove') {
			console.log(
				`Removing role ${newValue} from Admin list for Server: ${serverId}`
			);
			const index = serverConfig.Settings.Adminroles.indexOf(newValue, 0);
			serverConfig.Settings.Adminroles.splice(index);
		}

		serverConfig.save();
	}

	async setModRoles(serverId, action, newValue: any) {
		// First get the server based on the server id, so we can change the config required
		const serverConfig: any = await Server.findById(serverId);

		if (action === 'add') {
			console.log(
				`Adding role ${newValue} in Moderator list for Server: ${serverId}`
			);
			serverConfig.Settings.Moderatorroles.push(newValue);
		} else if (action === 'remove') {
			console.log(
				`Removing role ${newValue} from Moderator list for Server: ${serverId}`
			);
			const index = serverConfig.Settings.Moderatorroles.indexOf(
				newValue,
				0
			);
			serverConfig.Settings.Moderatorroles.splice(index);
		}

		serverConfig.save();
	}

	async setNewTwitterSetting(serverId, setting, newValue: any) {
		// First get the server based on the server id, so we can change the config required
		const serverConfig: any = await Server.findById(serverId);
		console.log(serverConfig);
		const formattedSettingName = [
			setting[0].toUpperCase(),
			...setting.slice(1),
		].join('');

		// the below If statement should check if the 'setting' that was passed actually exists in 'serverConfig' then process changes to the config
		try {
			
				console.log(
					`Updating Server Config ${serverId} with setting change: ${setting}`
				);

				if (
					serverConfig.Twitter[formattedSettingName] instanceof Array
				) {
					serverConfig.Twitter[formattedSettingName].push(newValue);
				} else {
					serverConfig.Twitter[formattedSettingName] = newValue;
				}

				serverConfig.save();
			
		} catch (error) {
			console.log(error);
		}
	}

	async setTwitterFeeds(serverId, newValue: Array<{}>) {
		// First get the server based on the server id, so we can change the config required
		const serverConfig: any = await Server.findById(serverId);

		// the below If statement should check if the 'setting' that was passed actually exists in 'serverConfig' then process changes to the config
		if (serverConfig.Twitter.Feeds) {
			serverConfig.Twitter.Feeds = newValue;

			serverConfig.save();
		}
	}
}

export default DB;
