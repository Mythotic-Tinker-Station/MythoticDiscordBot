import Mongoose from 'mongoose';
import { exit } from 'process';
import Server from './serversSchema';

class DB {

    constructor(dburl: string) {
        try {
            console.log("Attempting to connect to the database")
            Mongoose.connect(dburl,  { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false});
        } catch (error) {
            throw new Error("Database Connection failed. Please check your configuration");
            exit
        }
    }

    async getServerConfig(serverid) {
        
       const serverconf = await Server.findById(serverid)
        .then(response => {
            if (response === null) throw new Error(`Server not found in Database`)
            return(response);
            }
        )
        .catch(error => {
            throw Error(error)
        });

        return serverconf
    }

    async getAllServerConfigs() {
       
       const configs = await Server.find({}).exec()

       return(configs)
    }

    async createNewServerConfig(serverId, serverName) {
        const newServerDetails = new Server({
            _id: serverId,
            ServerName: serverName,
            Settings: {
                Prefix: "!",
                WelcomeMessage: "",
                AdminRoles: [],
                ModeratorRoles: []
            },
            Twitter: {
                Blockretweets: false,
                Blockreplies: false,
                Feeds: []
            }
        });

        await newServerDetails.save()
    
        
        
    }

    async setNewSetting (serverId, setting, newValue) {
        
        // First get the server based on the server id, so we can change the config required
        const serverConfig = await Server.findById(serverId).exec()

        if (serverConfig.) {
                
            console.log(`Updating Server Config ${serverId} with setting change: ${setting}`)
            const formattedSettingName = [setting[0].toUpperCase(), ...setting.slice(1)].join('');
            serverConfig._id.Settings[formattedSettingName] = newValue;

            serverConfig.save()
        }
        
    }


}


export default DB;