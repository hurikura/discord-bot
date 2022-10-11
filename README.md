# discord-bot

フリくらの[Discordサーバー](https://discord.com/invite/UsbHGENsc2)で利用しているBOTです。チケット、WikiやWordPressサイトの検索、Notionの連携コマンドなどを搭載しています。

## Usage

### configuration

#### Configure keys

```bash
BOT_TOKEN='for' # Discord BOT Token
OTHERS='bar' # Role ID
JE='baz' # Role ID
BE='qux' # Role ID
NOTION_DATABASE_ID='quux' # Notion Feedback Database ID
NOTION_API_KEY='corge' # Notion Integrations Token
WP_SITE_URL='grault' # WordPress Site URL
WIKI_URL='garply' # MediaWiki URL
TICKET='waldo' # Ticket Category ID
ADMIN='fred' # Admin Role ID
```

### Development

```bash
# install packages
$ npm install
# start local server
$ node index.js
Logged in as {client.user.tag}!
```

### Deployment

HerokuやRailwayなどにデプロイすることをおすすめします。

```bash
$ node index.js
```
