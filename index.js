const Discord = require('discord.js')
const client = new Discord.Client({disableEveryone : false})

const Base = require('kf-database')
const db = new Base({ name: 'birthdays' })

const config = require('./config')
let birthdays = require('./birthdays')

let guild
let commands

require('dotenv').config()

client.on('ready', () => {
    guild = client.guilds.cache.get(config.guildID)
    console.log(`Logged in as ${client.user.tag}`)

    // db.set('birthdays', birthdays)

    birthdaysPerMonth = db.get('birthdaysPerMonth')

    let now = new Date()

    birthdaysToLookFor = birthdaysPerMonth[now.getMonth()].concat(birthdaysPerMonth[(now.getMonth() + 1) % 12])

    console.log(birthdaysToLookFor)

    commands = require('./commands/commands')
})

client.on('message', (message) => {
    
    

    if (message.content[0] === "!") {

      content = message.content.slice(1)
      args = content.split(' ')

      command = args.shift()

      if(commands[command]) commands[command]({ client, guild, config, db, message }, args)
      else message.channel.send('This command doesn\'t exist')
    }
})

let dateChecker = () => {
    guild.channels.cache.get(config.channelID).send(`Joyeux anniversaire <@${'419840551781793802'}> <:tada:798513412869980190> <:partying_face:798513412869980190>`)
}



client.login(process.env.TOKEN)