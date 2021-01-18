/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    TwitchClient.js

    This file contains the Twitch code. it Creates a class
    to be used for creating the Twitch client. If you need to make changes to the client
    itself, this is the file to do it in.

    This file is required for stream notifications
    
*/
import { ApiClient, HelixStream, UserNameResolvable } from 'twitch';
import { ClientCredentialsAuthProvider } from 'twitch-auth';
import { DirectConnectionAdapter, EventSubListener } from 'twitch-eventsub';
import { BotClient } from '../Structures/BotClient';

export interface TwitchConfigOptions {
    clientId: string,
    clientSecret: string,
}

export interface TwitchListenConf {
    hostName: string,
    listenerPort: number
}

export class TwitchClient {
    client: BotClient;
    keys: TwitchConfigOptions;
    listenerOptions: TwitchListenConf;
    clientId: string;
    clientSecret: string;
    authProvider: ClientCredentialsAuthProvider;
    apiClient: ApiClient;
    listener: EventSubListener;

    constructor(client: BotClient, keys: TwitchConfigOptions, listenConf: TwitchListenConf) {
        this.client = client;
        this.clientId = keys.clientId;
        this.clientSecret = keys.clientSecret;

        this.authProvider = new ClientCredentialsAuthProvider(this.clientId, this.clientSecret)
        this.apiClient = new ApiClient({ authProvider: this.authProvider })

        //this.listener = new EventSubListener(this.apiClient, new DirectConnectionAdapter({
        //    hostName: listenConf.hostName,
        //    listenerPort: listenConf.listenerPort
        //}))
    }
    
    async subscribeToTwitchChannel(twitchUserName: UserNameResolvable) {
        let prevStream = this.apiClient.helix.streams.getStreamByUserName(twitchUserName);


    }
    
    async start() {
        await this.listener.listen().then(async () => console.log(`TwitchAPI has started listening...`));
    }

}