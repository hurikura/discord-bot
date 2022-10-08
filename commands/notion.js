const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

module.exports = {
  data: {
    name: "notion",
    description: "Notionのページやデータベースを検索します。",
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
     
      const emoji = page.icon?.type === "emoji" ? `${page.icon.emoji} ` : ""
     
      const title = (() => {
        switch (page.object) {
            case 'page':
                const titleProperty = Object.entries(page.properties).map(([, value]) => value).find(({ type }) => {
                    return type === 'title';
                })

                return titleProperty?.title[0].plain_text || 'タイトルなし';
            case 'database':
                return page.title[0].plain_text || 'タイトルなし';
        }
    })();
      
      const status = (() => {
          if (page.parent.type === "database_id" && page.parent.database_id === "92f75630-2223-49e6-8391-3c99d8dada69") {
              return ` (${page.properties.Status.status.name})`
          } else if (page.parent.type === "database_id" && page.parent.database_id === "14c06d0d-4723-4891-ab55-6f22f64ad352") {
                return ` (${page.properties.Status.status.name})`
          } else {
                return ""
          }
      })();
      
      const field = {
        name: emoji + title,
        value: page.url,
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
