//Copyright (c) 2021 SierraNB - https://github.com/SierraNB - www.greggory.gay
const http = require('http')
const Discord = require('discord.js')
const client = new Discord.Client();
//Fill this in with your own data.
const IP = 'YOUR_PIHOLE_IP_ADDRESS_HERE'
const ownersname = 'YOUR_NAME_HERE'
const token = 'YOUR_BOT_TOKEN_HERE'
const prefix = 'YOUR_PREFIX_HERE' //I used ph?
const profilepicture = 'PROFILE_PICTURE_URL_HERE'
//basic command handler stuff
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    //The stats command
    if (command === 'stats') {
        //Sends an HTTP request to the pihole
        http.get(`http://${IP}/admin/api.php`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                //Makes an embed with all the pihole API data.
                let piholedata = JSON.parse(data)
                const embed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTimestamp()
                    .setThumbnail(profilepicture)
                    .addFields(
                        {
                            name: 'Domains being blocked',
                            value: `${piholedata.domains_being_blocked}`,
                        },
                        {
                            name: 'DNS queries today',
                            value: `${piholedata.dns_queries_today}`,
                        },
                        {
                            name: 'Ads blocked today',
                            value: `${piholedata.ads_blocked_today}`,
                        },
                        {
                            name: 'Ads percentage today',
                            value: `${Math.round(piholedata.ads_percentage_today)}%`,
                        }
                    )
                //Sends the embed
                              message.channel.send(embed)
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
    //Sends how long your pihole as been up, assuming you're hosting this on your pihole device.
    if (command === 'uptime') {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;
        await message.channel.send('My uptime is `' + `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds` + '`.')
    }
    //Simple help command.
    if (command === 'help') {
        await message.reply('my prefix is ``' + prefix + '`` and my commands are ``stats, uptime, ping``')
    }
    //Simple ping command.
    if (command === 'ping') {
        await message.reply('pong!')
    }
})
//Status thing and confirming the bot has logged into discord and hasn't erroed
client.on('ready', () => {
    console.log('Logged in!')
    client.user.setActivity(`${ownersname}'s internet | ${prefix}`, {type: 'WATCHING'})
});
client.login(token)
