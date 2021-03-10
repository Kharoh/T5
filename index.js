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


    // Setting up all the birthdays by month


    // birthdaysPerMonth = new Array(12).fill(null).map(() => [])

    // birthdays.forEach(birth => {
    //     birthdaysPerMonth[birth.date.month - 1].push(birth)
    // })

    // birthdaysPerMonth.forEach(month => month.sort((a, b) => a.date.day - b.date.day))



    // Creating a chronogical array of birthdays from today


    // let now = new Date()

    // birthdaysToLookFor= birthdaysPerMonth.slice(now.getMonth()).concat(birthdaysPerMonth.slice(0, now.getMonth()))

    // birthdaysToLookFor.push(birthdaysToLookFor[0].filter(birthday => birthday.date.day < now.getDate()))

    // birthdaysToLookFor[0] = birthdaysToLookFor[0].filter(birthday => birthday.date.day >= now.getDate())

    // birthdaysFromOtherMonths = birthdaysToLookFor.slice(1)

    // birthdaysToLookFor = birthdaysToLookFor[0]

    // for(month of birthdaysFromOtherMonths) {
    //     month.forEach(birthday => {
    //         birthdaysToLookFor.push(birthday)
    //     })
    // }

    

    // Initialising the database
    
    // db.set('birthdaysPerMonth', birthdaysPerMonth)

    // db.set('birthdays', birthdays)

    // db.set('birthdaysToLookFor', birthdaysToLookFor)


    birthdays = db.get('birthdays')

    birthdaysPerMonth = db.get('birthdaysPerMonth')

    birthdaysToLookFor = db.get('birthdaysToLookFor')


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

      if(commands[command]) commands[command]({ puppeteer, Discord, client, guild, env: process.env, config, db, message }, args)
      else message.channel.send('This command doesn\'t exist')
    }
})

let dateChecker = async () => {
    
    let waitForBirthday = async (birthday) => {
        let now = new Date()
        console.log(new Date(now.getFullYear(), birthday.date.month, birthday.date.day, birthday.date.hour, birthday.date.minute, birthday.date.seconde).getTime() - new Date().getTime())

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('sending message')
                console.log(birthday)
                guild.channels.cache.get(config.channelID).send(`Joyeux anniversaire <@${birthday.id}> <:tada:798513412869980190> <:partying_face:798513412869980190>`)
                birthdaysToLookFor.push(birthdaysToLookFor.shift())
                db.set('birthdaysToLookFor', birthdaysToLookFor)
                resolve('Resolved')
            }, birthday.date.day === now.getDate() ? (new Date(now.getFullYear(), birthday.date.month, birthday.date.day, birthday.date.hour, birthday.date.minute, birthday.date.seconde).getTime() - new Date().getTime()) : 86400000)
        })

        return promise
    }
    
    while(true) {
        let promise = await waitForBirthday(birthdaysToLookFor[0])
        console.log(promise)
    }
}

let horoscope = () => {
    let now = new Date()
    if(db.get('horoscope') !== now.getDay()) {
        sendHoroscope()
    }

    now = new Date()
    setTimeout(async() => {
        await sendHoroscope()
        horoscope()
    }, (new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - new Date().getTime()))
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
            .setAuthor('T5', 'https://cdn.discordapp.com/avatars/651859468920946738/b2a57698754089238268680b58192e06.png?size=128')
            

        if(content.length < 1000) {
            embed.addField("Horoscope du jour", content)
        } else {
            let firstHalf = content.substring(0, content.length / 2)
            let secondHalf = content.substring(content.length / 2, content.length)

            firstHalf += secondHalf.slice(0, secondHalf.indexOf('. ') + 2)
            secondHalf = secondHalf.slice(secondHalf.indexOf('. ') + 2, secondHalf.length)

            embed.addField('Horscope du jour (1/2)', firstHalf)
            embed.addField('Horscope du jour (2/2)', secondHalf)
        }

        guild.channels.cache.get(config.astroChannelID).send(embed)
    }

    db.set('horoscope', new Date().getDate())
}



client.login(process.env.TOKEN)