const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;

module.exports = {
  data: {
    name: "feedback",
    description: "フィードバックをNotionに登録します。",
    options: [{
      type: "STRING",
      name: "title",
      description: "フィードバック内容",
      required: true
    }],
  },
  async execute(interaction) {

    const title = interaction.options.getString("title");

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    })

    const url = response["url"];;

    await interaction.reply({
      content: `「${title}」を作成しました\n` + url,
    });
  }
}