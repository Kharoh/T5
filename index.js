const Discord = require('discord.js')
const client = new Discord.Client({disableEveryone : false})

const Base = require('kf-database')
const db = new Base({ name: 'birthdays' })

const puppeteer = require('puppeteer')

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

    // console.log(birthdaysPerMonth)

    birthdaysToLookFor = birthdaysPerMonth[now.getMonth()].concat(birthdaysPerMonth[(now.getMonth() + 1) % 12])

    console.log(birthdaysToLookFor)

    commands = require('./commands/commands')

    let main = async () => {
        dateChecker()
        horoscope()
    }

    main()
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
        console.log(new Date(now.getFullYear(), birthday.date.month, birthday.date.day, birthday.date.hour, birthday.date.minute, birthday.date.seconde).getTime() - new Date().getTime())
        setTimeout(() => {
            console.log('sending message')
            console.log(birthday)
            guild.channels.cache.get(config.channelID).send(`Joyeux anniversaire <@${birthday.id}> <:tada:798513412869980190> <:partying_face:798513412869980190>`)
            birthdaysToLookFor.shift()
        }, birthday.date.day === now.getDate() ? (new Date(now.getFullYear(), birthday.date.month, birthday.date.day, birthday.date.hour, birthday.date.minute, birthday.date.seconde).getTime() - new Date().getTime()) : 86400000)
    }

    // birthdaysToLookFor.unshift({
    //     id: '419840551781793802',
    //     date: {
    //         month: 0,
    //         day: 15,
    //         hour: 21,
    //         minute : 08,
    //         seconde: 25
    //     }
    // })
    
    for(birthday of birthdaysToLookFor) {
        waitForBirthday(birthday)
    }
}

let horoscope = () => {
    let now = new Date()
    if(db.get('horoscope') !== now.getDay()) {
        sendHoroscope()
    }

    // console.log(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - new Date().getTime())
    now = new Date()
    setTimeout(async() => {
        await sendHoroscope()
        horoscope()
    }, (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - new Date().getTime()))
    // }, 0)
}

let sendHoroscope = async() => {

    if(db.get('horoscope') === new Date().getDate()) return
    let browser = await puppeteer.launch()
    let page = await browser.newPage()

    await page.setDefaultNavigationTimeout(0)
    await process.setMaxListeners(0)

    let signs = [
        ['Bélier', 'https://cafeastrology.com/ariesdailyhoroscope.html'],
        ['Taureau', 'https://cafeastrology.com/taurusdailyhoroscope.html'],
        ['Gémeaux', 'https://cafeastrology.com/geminidailyhoroscope.html'],
        ['Cancer', 'https://cafeastrology.com/cancerdailyhoroscope.html'],
        ['Lion', 'https://cafeastrology.com/leodailyhoroscope.html'],
        ['Vierge', 'https://cafeastrology.com/virgodailyhoroscope.html'],
        ['Balance', 'https://cafeastrology.com/libradailyhoroscope.html'],
        ['Scorpion', 'https://cafeastrology.com/scorpiodailyhoroscope.html'],
        ['Sagittaire', 'https://cafeastrology.com/sagittariusdailyhoroscope.html'],
        ['Capricorne', 'https://cafeastrology.com/capricorndailyhoroscope.html'],
        ['Verseau', 'https://cafeastrology.com/aquariusdailyhoroscope.html'],
        ['Poisson', 'https://cafeastrology.com/piscesdailyhoroscope.html']
    ]

    for([sign, url] of signs) {
        let navPromise = page.waitForNavigation({ waitUntil: "networkidle0" })
        await page.goto(url)
        await navPromise
        content = await page.evaluate(() => [...document.querySelectorAll('main.content div.entry-content p')].map(elt => elt.textContent))

        content = content[3].slice(content[3].indexOf('/>') + 2)

        let embed = new Discord.MessageEmbed()
            .setColor('#E74C3C')
            .setTitle(sign)
            .setURL(url)
            .setAuthor('Alias', 'https://cdn.discordapp.com/avatars/651859468920946738/b2a57698754089238268680b58192e06.png?size=128')
            .addField("Horoscope du jour", content)

        guild.channels.cache.get(config.astroChannelID).send(embed)
    }

    db.set('horoscope', new Date().getDate())
}



client.login(process.env.TOKEN)