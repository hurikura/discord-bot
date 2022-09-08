const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

module.exports = {
  data: {
    name: "notion",
    description: "Notionのページやデータベース  を検索します。",
    options: [{
      type: "STRING",
      name: "query",
      description: "検索キーワードを入力します。",
      required: true
    }],
  },
  async execute(interaction) {

    const query = interaction.options.getString("query");

    const response = await notion.search({
      query: query,
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    });

    const fields = [];
    response.results.map((page) => {

      const url = page.url;

      const field = {
        name: `${page.id}`,
        value: `${url}`,
      };
      fields.push(field);
    });

    const description = Object.keys(response.results).length === 0 ? "相当なし" : Object.keys(response.results).length + "件のページやデータベースが見つかりました。"

    await interaction.reply({
      embeds: [
        {
          title: `「${query}」の検索結果`,
          fields: fields,
          description: description,
          color: 5620992,
          timestamp: new Date(),
        },
      ],
    });
  }
}
