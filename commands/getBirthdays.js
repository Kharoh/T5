module.exports = ({ client, guild, config, db, message }) => {
    let newMsg = 'Notifications prévues : '
    db.get('birthdays').forEach((member) => {
        newMsg += (`<@${member.id}> a sa notification d'anniversaire de prévu le ${member.date.day}/${member.date.month} à ${member.date.hour}h${member.date.minute}min${member.date.seconde}\n`)
    })
    console.log(newMsg)
    message.channel.send(newMsg)
  
}