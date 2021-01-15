const birthdays = require("../birthdays")

module.exports = ({ client, guild, config, db, message }, args) => {
    
    newBirthdays = db.get('birthdays')

    birthday = {
        id: args[0],
        date: {
            month: parseInt(args[1]),
            day: parseInt(args[2]),
            hour: parseInt(args[3]),
            minute: parseInt(args[4]),
            seconde: parseInt(args[5])
        }
    }

    newBirthdays.push(birthday)


    birthdaysPerMonth = db.get('birthdaysPerMonth')

    birthdaysPerMonth[args[1] - 1].push(birthday)

    birthdaysPerMonth[args[1] - 1].sort((a, b) => a.date.day - b.date.day)

    db.set('birthdaysPerMonth', birthdaysPerMonth)

    
    db.set('birthdays', newBirthdays)

    console.log(db.get('birthdays'))
    

    message.channel.send('Notification ajoutée')
}