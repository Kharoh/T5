const { DiscordAPIError } = require("discord.js")

module.exports = ({ Discord, client, guild, config, db, message }, args) => {

    args.shift()
    console.log(message.mentions.channels.first().id)

    const embed = new Discord.MessageEmbed()
        .setColor('#E74C3C')
        .setTitle('Message envoyé')
        .setAuthor('T5', 'https://cdn.discordapp.com/icons/774288416467714049/a002f9e3960163b05d68a86955e98621.webp?size=128')
        .addField(`${message.author.tag} a demandé l'envoi de ${args.join(' ')} sur le salon ${message.mentions.channels.first().name}`)

    guild.channels.cache.get('809882043709128706').send(embed)

    message.mentions.channels.first().send(args.join(' '))

}