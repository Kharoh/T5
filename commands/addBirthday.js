const birthdays = require("../birthdays")

module.exports = ({ client, guild, config, db, message }, args) => {
    
    newBirthdays = db.get('birthdays')
    newBirthdays.push({
        id: args[0],
        date: {
            month: parseInt(args[1]),
            day: parseInt(args[2]),
            hour: parseInt(args[3]),
            minute: parseInt(args[4]),
            seconde: parseInt(args[5])
        }
    })

    db.set('birthdays', newBirthdays)

    console.log(db.get('birthdays'))

    message.channel.send('Notification ajoutée')
}