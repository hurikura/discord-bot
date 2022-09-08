const fs = require('fs')
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ], partials: ["GUILD_MEMBER", "USER"]
});

const commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command
}

client.once("ready", async () => {
    const data = [];
    for (const commandName in commands) {
        data.push(commands[commandName].data);
    }
    await client.application.commands.set(data);
    client.user.setActivity(`Minecraft`, {
        type: "PLAYING",
    });
    console.log(`Logged in as ${client.user.tag}!`);
});

const ticket = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('チケットの作成')
    .setDescription('個別の相談などの場合はチケットを作成してください。');

const ticket_row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('ticket')
            .setLabel('📬 チケットの作成')
            .setStyle('PRIMARY'),
    );

const edition = new MessageEmbed()
    .setColor('#0099ff')
    .setAuthor({ name: 'エディションの選択', iconURL: 'https://variouscolors.net/game/wp-content/uploads/2021/05/reference.png' })
    .setDescription('プレイしているエディションを選択することで対応したロールが付与されます。(複数選択可)');

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('java')
            .setLabel('Java Edition')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('be')
            .setLabel('Bedrock Edition')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('others')
            .setLabel('その他')
            .setStyle('SECONDARY'),
        new MessageButton()
            .setCustomId('no')
            .setLabel('ヘルプを表示')
            .setStyle('SECONDARY'),
    );

client.on('messageCreate', message => {

    if (message.author.id === '') {
        message.channel.send({ embeds: [edition], components: [row] });
    }


});


client.on('messageCreate', message => {

    if (message.author.id === '') {
        message.channel.send({ embeds: [ticket], components: [ticket_row] });
    }


});

client.on('interactionCreate', async (interaction) => {

    const guild = await interaction.guild.fetch();
    const member = await guild.members.fetch(interaction.member.user.id, {
        force: true // intentsによってはGuildMemberUpdateが配信されないため
    });

    if (interaction.customId === "java") {

        const je_role = process.env.BE
        const role_mention = `<@&${je_role}>`;

        if (member.roles.resolve(je_role)) {

            await member.roles.remove(je_role);

            await interaction.reply({
                content: `${role_mention}を削除しました。もう一度付与したい場合はクリックしてください。`,
                ephemeral: true
            });
            return;
        }

        await member.roles.add(je_role);

        await interaction.reply({

            content: `${role_mention}を付与しました。ロールを外したい場合はもう一度クリックしてください。`,
            ephemeral: true
        });

    } else if (interaction.customId === "be") {

        const be_role = process.env.BE
        const role_mention = `<@&${be_role}>`;

        if (member.roles.resolve(be_role)) {

            await member.roles.remove(be_role);

            await interaction.reply({
                content: `${role_mention}を削除しました。もう一度付与したい場合はクリックしてください。`,
                ephemeral: true
            });
            return;
        }

        await member.roles.add(be_role);

        await interaction.reply({

            content: `${role_mention}を付与しました。ロールを外したい場合はもう一度クリックしてください。`,
            ephemeral: true
        });
    } else if (interaction.customId === "others") {

        const others_role = process.env.OTHERS
        const role_mention = `<@&${others_role}>`;

        if (member.roles.resolve(others_role)) {

            await member.roles.remove(others_role);

            await interaction.reply({
                content: `${role_mention}を削除しました。もう一度付与したい場合はクリックしてください。`,
                ephemeral: true
            });
            return;
        }

        await member.roles.add(others_role);

        await interaction.reply({

            content: `${role_mention}を付与しました。ロールを外したい場合はもう一度クリックしてください。`,
            ephemeral: true
        });
    } else if (interaction.customId === "ticket") {

        const ticketid = interaction.user.id

        if (interaction.guild.channels.cache.find(name => name.name === ticketid)) return interaction.reply({
            content: "すでにチャンネルが存在します。",
            //メッセージ
            ephemeral: true
            //その人にしか見れないようにする
        });

        await interaction.guild.channels.create(ticketid, {
            //チャンネルを作る
            permissionOverwrites: [{
                id: interaction.guild.roles.everyone,
                //すべての人(everyone)の権限設定
                deny: ['VIEW_CHANNEL']
                //チャンネルを見ることを禁止する
            }],
            parent: process.env.TICKET
            //ticketカテゴリーにチャンネルを作る
        }).then(channels => {
            //成功した場合
            channels.permissionOverwrites.edit(interaction.user.id, {
                //ボタンを押したユーザーのチャンネルない権限を変更
                VIEW_CHANNEL: true
                //チャンネルを見ることを許可する
            });
            const tic2 = new MessageButton().setCustomId("close").setStyle("DANGER").setLabel("閉じる");
            //buttonを作成
            channels.send({
                content: `<@${interaction.user.id}>`,
                embeds: [{
                    description: `チケットを作成しました。これは管理者ロールが付いたスタッフとあなたのみが閲覧できます。相談内容などを記入してください。チャットが終了したら「閉じる」をクリックしてください。`
                }],
                components: [new MessageActionRow().addComponents(tic2)]
                //buttonを送信
            })
            client.channels.cache.get('1001306657097273484').send({
                content: `<@${interaction.user.id}>さんによって新しいチケット、${channels}が作成されました。確認してください。<@&${process.env.ADMIN}>`,
            })
            interaction.reply({
                content: `${channels}が作成されました。`,
                //メッセージ
                ephemeral: true
                //押した人にしか見れないようにする
            });
        }).catch(e => interaction.reply(`エラー:${e.message}`))

    } else if (interaction.customId === "close") {

        interaction.channel.delete().catch(e => interaction.reply(`エラー:${e.message}`))

        client.channels.cache.get('1001306657097273484').send({
            content: `<@${interaction.user.id}>さんのチケットはcloseされました。`,
        })

    } else if (interaction.customId === "no") {

        await interaction.reply({
            content: 'Minecraftの始め方について、参考になるリンクを共有します。\nhttps://variouscolors.net/game/minecraft/reference/contents/',
            ephemeral: true,
        });
    }

});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
});


client.login(process.env.BOT_TOKEN)