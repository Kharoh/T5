const Discord = require('discord.js')
const client = new Discord.Client({disableEveryone : false})

const Base = require('kf-database')
const db = new Base({ name: 'birthdays' })

const config = require('./config')
let birthdays = require('./birthdays')

let guild
let commands
let birthdaysToLookFor
let birthdaysPerMonth

require('dotenv').config()

client.on('ready', () => {
    guild = client.guilds.cache.get(config.guildID)
    console.log(`Logged in as ${client.user.tag}`)

    // birthdays = db.get('birthdays')

    // db.delete('birthdaysPerMonth')

    // birthdaysPerMonth = new Array(12).fill(null).map(() => [])

    // birthdays.forEach(birth => {
    //     birthdaysPerMonth[birth.date.month - 1].push(birth)
    // })

    // birthdaysPerMonth.forEach(month => month.sort((a, b) => a.date.day - b.date.day))

    // db.set('birthdaysPerMonth', birthdaysPerMonth)

    // db.set('birthdays', birthdays)

    birthdaysPerMonth = db.get('birthdaysPerMonth')

    birthdays = db.get('birthdays')

    // birthdaysPerMonth[0].shift()

    // birthdays.splice(5, 1)


    // console.log(birthdaysPerMonth[0])

    // console.log(birthdays)

    // db.set('birthdays', birthdays)

    // db.set('birthdaysPerMonth', birthdaysPerMonth)

    let now = new Date()

    birthdaysToLookFor = birthdaysPerMonth[now.getMonth()].concat(birthdaysPerMonth[(now.getMonth() + 1) % 12])

    console.log(birthdaysToLookFor)

    commands = require('./commands/commands')

    dateChecker()
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
    
    let waitForBirthday = (birthday) => {
        let now = new Date()
        console.log(birthday.date.day === now.getDate() ? ( birthday.date.hour - now.getHours()) * 3600000 + (birthday.date.minute - now.getMinutes()) * 60000 +(birthday.date.seconde - now.getSeconds()) * 1000 : 86400000)
        setTimeout(() => {
            console.log('sending message')
            console.log(birthday)
            guild.channels.cache.get(config.channelID).send(`Joyeux anniversaire <@${birthday.id}> <:tada:798513412869980190> <:partying_face:798513412869980190>`)
            birthdaysToLookFor.shift()
        }, birthday.date.day === now.getDate() ? ( birthday.date.hour - now.getHours()) * 3600000 + (birthday.date.minute - now.getMinutes()) * 60000 +(birthday.date.seconde - now.getSeconds()) * 1000 : 86400000)
    }

    birthdaysToLookFor.unshift({
        id: '419840551781793802',
        date: {
            month: 0,
            day: 15,
            hour: 19,
            minute : 35,
            seconde: 25
        }
    })
    
    for(birthday of birthdaysToLookFor) {
        waitForBirthday(birthday)
    }
}



client.login(process.env.TOKEN)