const { DiscordAPIError } = require("discord.js")

module.exports = ({ Discord, client, guild, config, db, message }, args) => {

  let channel
    if(message.mentions.channels.first()) {
        channel = message.mentions.channels.first()
        args.shift()
    } else {
        channel = message.channel
    }

  if (args.length === 0) return message.channel.send('Le contenu du message à envoyer est vide (merci Lucas pour la commande)')

  const embed = new Discord.MessageEmbed()
    .setColor('#E74C3C')
    .setTitle('Message envoyé')
    .setAuthor('T5', 'https://cdn.discordapp.com/icons/774288416467714049/a002f9e3960163b05d68a86955e98621.webp?size=128')
    .addField("Description de l'ordre", `${message.author.tag} a demandé l'envoi de ${args.join(' ')} sur le salon ${channel.name} en tts`, false)


  guild.channels.cache.get('809882043709128706').send(embed)

  channel.send(args.join(' '), { tts: true })

  message.delete()
}
