const axios = require("axios");
const site = process.env.WIKI_URL;

module.exports = {
  data: {
    name: "wiki",
    description: "フリくらWiki (wiki.freecraft-web.com) を検索します。",
    options: [{
      type: "STRING",
      name: "keyword",
      description: "キーワード",
      required: true
    }],
  },
  async execute(interaction) {

    const keyword = interaction.options.getString("keyword");

    const res = await axios.get(encodeURI(`${site}/api.php?action=query&list=search&srsearch=${keyword}&format=json`))

    const fields = [];
    res.data.query.search.map((page) => {
      const title = page.title
      const url = `${site}/index.php?title=` + title;
      const field = {
        name: `${title}`,
        value: `${url}`,
      };
      fields.push(field);
    });

    const description = res.data.query.searchinfo.totalhits === 0 ? "問い合わせに合致する検索結果はありませんでした。" : `${res.data.query.searchinfo.totalhits}件のページが見つかりました。`

    await interaction.reply({
      embeds: [
        {
          title: `「${keyword}」の検索結果`,
          description: description,
          fields: fields,
          color: 5620992,
          timestamp: new Date(),
        },
      ],
    });

  }
}
