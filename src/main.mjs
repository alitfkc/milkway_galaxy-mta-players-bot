//settings
const TOKEN = "";
const activities_status = "online";
const activities_name = "";
const channelId = '';
const serverIp = ''; // MTA sunucusunun IP adresi
const serverPort = ; // MTA sunucusunun portu
const refresh_time = 5000;//refresh time
const server_name = "";
const description = "";
const image = "https://cdn.discordapp.com/attachments/941753982169251901/1140916566708469861/png_logo.png?ex=651e6bda&is=651d1a5a&hm=b22d43441e0c387e88254b80e92d35017f459ef351bf5ef15c3fab3c86497048&"
const color = 0x0099ff;
// imports 
import { Client ,Collection} from "discord.js";
import gamedig from 'gamedig';

var msg = null;


// Bot İntents
const client = new Client({
    intents: ["GuildEmojisAndStickers","GuildMessages","GuildPresences","GuildMessageReactions","Guilds","MessageContent","GuildModeration"],
    // presence :[ { status: settings.activities_status,activities :[{name:settings.activities_name,type:settings.activities_type}]}]

})


client.on("ready", () => {
    console.log("Bot is ready.")
    client.user.setStatus(activities_status);

    client.user.setActivity(activities_name)

    setInterval(startFuncs,refresh_time);

})

async function startFuncs() {
    getPlayersList((playerList) => {
        var items = []
        var players = "";
        playerList.forEach((v) => {
            players += "    ↳   "+v+"\n"
        });
        items.push({name:"Çevrimiçi Oyuncular",value:players});
        console.log(playerList.length);
        typePlayerList(items,playerList.length);
    });
}
async function typePlayerList(items,count) {
    
    const embed = {
        color: color,
        title: count.toString()+" Kişi "+server_name+" oynuyor.",
        description: description,
        fields: items,
        timestamp: new Date(),
        footer: {
            text: server_name,
        },
        image: {
            url: image, // Resmin URL'sini buraya ekleyin
        },  
    };
    if (msg == null)  {
        const channel = await client.channels.fetch(channelId);
        msg = await channel.send({ embeds: [embed] });
    }
    else {
        await msg.edit({ embeds: [embed] });
    }

    client.user.setActivity(count.toString()+" Kişi "+server_name)

}

async function getPlayersList(callback) {
    var player_list = [];
    gamedig.query({
        type: 'mtasa', // MTA:SA sunucusu olduğunu belirtin
        host: serverIp,
        port: serverPort
    }).then((state) => {
        if (state.players.length > 0) {
            console.log('Çevrimiçi Oyuncular:');
            
            state.players.forEach((player) => {
                //console.log(`${player.name} (${player.score})`);

                player_list.push(player.name);
            });
        } else {
            console.log('Çevrimiçi oyuncu bulunmuyor.');
        }
        callback(player_list); // İşlem tamamlandığında geri çağırma fonksiyonunu çağır
    }).catch((error) => {
        console.error('Oyuncu verilerini çekerken hata oluştu:', error);
        callback(player_list); // Hata durumunda da geri çağırma fonksiyonunu çağır
    });
};


client.login(TOKEN)
