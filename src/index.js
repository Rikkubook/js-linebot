const express = require("express");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const app = express();
// 開出一個app
// 打webhook網址，會用line middleware 將用戶訊息跳轉，並通過 config進行認證
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);
// 這邊500則內免付費
// client.pushMessage("U07061dbccd7d41a0c3cbf4627aaca180", {
//   type: "text",
//   id: "14638652060657",
//   text: "我在測試02"
// });

function handleEvent(event) {
  console.log(event);
  // 如果不是message且不是文字訊息，則不動作
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  // 回傳訊息
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text
  });
}

app.listen(3000);
