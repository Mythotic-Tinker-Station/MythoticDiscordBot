import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';
import Responses from '../../LocalData/8ballResponses.json'
import { CommandInteraction } from 'discord.js';

const emojiList: Object = {
    HAPPY: "<:afinasmileemoji:718531783548731472>",
    SMUG: "<:afinaSmug:585427931237580803>",
    CHEEKY: "<:afinap:718551955324272820>",
    HITSBLUNT: "<:afinaHitsblunt:589801921314029608>",
    WTF: "<:afinaemojiwtf:719903474258674014>",
    SAD: "<:afinaemojisadface:725733589655879719>",
    PARTY: "<:afinaemojiparty:725782861487013992>",
    LAUGH: "<:afinaemojilmao:725771797659910154>",
    DEATH: "<:afinaemojiikillyou:725763329951531068>",
    GRIN: "<:afinaemojihmph:724704798699421767>",
    ANGER: "<:afinaemojihmpf:719903944985280554>",
    THINK: "<:afinaemojihmm:719899680691060782>",
    FACEPALM: "<:afinaemojifacepalm:724700382806147072>",
    FOOD: "<:afinaemojidrool:719912373212676126>",
    EVIL: "<:afinaemojidevil:724586267068858378>",
    BLEH: "<:afinaemojibleh:719661813230338148>"
}

const whatResponses = Responses.What;
const whenResponses = Responses.When;
const howResponses = Responses.How;
const whereResponses = Responses.Where;
const whyResponses = Responses.Why;
const whichResponses = Responses.Which;

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = '8ball';
		const options: CommandOptions = {
			name: '8ball',
			aliases: ['future', 'ask', 'Hey Afina,', 'tell'],
			description: 'Ask Afina a question and she will reply! She can tell you how the future may play out...',
			category: 'Fun',
			usage: '8ball <your question>',
            slash_options: {
                name: '8ball',
                description: 'Ask Afina a question and she will reply! She can tell you how the future may play out... Good luck!',
                options: [{
                    name: 'question',
                    description: "The question you would like to ask Afina",
                    type: "STRING",
                    required: true
                }]
            }
        };

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the set command.'
		);
	}

    async responseGenerate(emoji, text: String) {
        const reply = `${emojiList[emoji]} ${text}`;
        return reply
    }

    async selectResponse(collection) {
        const selectedResponse = collection[Math.floor(Math.random() * collection.length)]
        return selectedResponse
    }

	async run(message, setting) {
        console.log(setting)
        
        // Must extract the type of question first, required if we are going to check which type it is
        const questionType = setting[0]
        let chosenResponse = null
        let reply = null

        // Switch to determine which respose collection to use and generate the response accordingly

        switch (questionType.toLowerCase()) {
            case "what":
                chosenResponse = await this.selectResponse(whatResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return await message.channel.send(reply)
            case "when":
                chosenResponse = await this.selectResponse(whenResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return await message.channel.send(reply)
            case "how":
                chosenResponse = await this.selectResponse(howResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return await message.channel.send(reply)
            case "where":
                chosenResponse = await this.selectResponse(whereResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return await message.channel.send(reply)
            case "why":
                chosenResponse = await this.selectResponse(whyResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return await message.channel.send(reply)
            case "which":
                chosenResponse = await this.selectResponse(whichResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return await message.channel.send(reply)
            default:
                // If none of the types match up, just facepalm
                return await message.channel.send(`${emojiList["FACEPALM"]} Come again???`)
        }
	}

    async slash_run(command, commandInfo: CommandInteraction, args) {
        const setting: string = args[0]
        console.log(setting)
        
        // Must extract the type of question first, required if we are going to check which type it is
        const questionType = setting.split(' ').shift()
        console.log(questionType)
        let chosenResponse = null
        let reply = null
    
        // Switch to determine which respose collection to use and generate the response accordingly

        switch (questionType.toLowerCase()) {
            case "what":
                chosenResponse = await this.selectResponse(whatResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return reply
            case "when":
                chosenResponse = await this.selectResponse(whenResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return reply
            case "how":
                chosenResponse = await this.selectResponse(howResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return reply
            case "where":
                chosenResponse = await this.selectResponse(whereResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return reply
            case "why":
                chosenResponse = await this.selectResponse(whyResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return reply
            case "which":
                chosenResponse = await this.selectResponse(whichResponses)
                reply = await this.responseGenerate(chosenResponse.Emoji, chosenResponse.Text)
                return reply
            default:
                // If none of the types match up, just facepalm
                return `${emojiList["FACEPALM"]} Come again???`
        }
	}
};