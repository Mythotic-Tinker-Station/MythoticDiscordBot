/*
Discord Server data shit
*/
import Mongoose, { Schema } from 'mongoose';

const serverSchema = new Schema(
    {
        _id: String,
        ServerName: String,
        Settings: {
            Prefix: String,
            WelcomeMessage: String,
            AdminRoles: [],
            ModeratorRoles: []
        },
        Twitter: {
            Blockretweets: Boolean,
            Blockreplies: Boolean,
            Feeds: []
        }
    }
);

const Server = Mongoose.model('Server', serverSchema);

export default Server;