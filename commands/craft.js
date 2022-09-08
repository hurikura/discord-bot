const axios = require("axios");
const site = process.env.WP_SITE_URL;

module.exports = {
  data: {
    name: "craft",
    description: "Various Colors CRAFTの記事を検索します。",
    options: [{
      type: "STRING",
      name: "keyword",
      description: "キーワード",
      required: true
    }],
  },
  async execute(interaction) {

    const keyword = interaction.options.getString("keyword");

    const res = await axios.get(encodeURI(`${site}/wp-json/wp/v2/posts?search=${keyword}`));

    const fields = [];
    res.data.map((article) => {
      const title = article.title.rendered
      const url = article.link;
      const field = {
        name: `${title}`,
        value: `${url}`,
      };
      fields.push(field);
    });

    const description = Object.keys(res.data).length === 0 ? "指定されたキーワードでは記事が見つかりませんでした。" : Object.keys(res.data).length + "件の投稿が見つかりました。"

    await interaction.reply({
      embeds: [
        {
          title: `「${keyword}」の検索結果`,
          url: encodeURI(`${site}/?s=${keyword}`),
          description: description,
          fields: fields,
          color: 5620992,
          timestamp: new Date(),
        },
      ],
    });
  }
}