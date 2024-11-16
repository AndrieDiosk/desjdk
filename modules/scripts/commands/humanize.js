const axios = require("axios");

module.exports.config = {
  name: "humanize",
  author: "Cliff",
  version: "1.0",
  category: "utility",
  description: "Humanizer Text",
  adminOnly: false,
  usePrefix: false,
  cooldown: 5,
};

module.exports["run"] = async ({ event, args}) => {
  async function getMessage(mid) {
    return await new Promise(async (resolve, reject) => {
      if (!mid) resolve(null);
      await axios
        .get(`https://graph.facebook.com/v21.0/${mid}?fields=message&access_token=${global.PAGE_ACCESS_TOKEN}`)
        .then((data) => {
          resolve(data.data.message);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  let content = "";

  if (event.type === "message_reply" && event.message) {
    content = await getMessage(event.message.reply_to.mid);
  } else if (args && args.length > 0) {
    content = args.join(" ");
  }

  if (!content) {
    api.sendMessage("Please provide a text or reply by message", event.sender.id);
    return;
  }

  const result = await axios
    .get(`https://ccprojectapis.ddns.net/api/aihuman?text=${encodeURIComponent(content)}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      return null;
    });

  if (!result || result.error !== "No") {
    api.sendMessage("An error occurred while processing the text. Please try again later.", event.sender.id);
    return;
  }

  function formatFont(text) {
    const fontMapping = {
      A: "𝗔",
      B: "𝗕",
      C: "𝗖",
      D: "𝗗",
      E: "𝗘",
      F: "𝗙",
      G: "𝗚",
      H: "𝗛",
      I: "𝗜",
      J: "𝗝",
      K: "𝗞",
      L: "𝗟",
      M: "𝗠",
      N: "𝗡",
      O: "𝗢",
      P: "𝗣",
      Q: "𝗤",
      R: "𝗥",
      S: "𝗦",
      T: "𝗧",
      U: "𝗨",
      V: "𝗩",
      W: "𝗪",
      X: "𝗫",
      Y: "𝗬",
      Z: "𝗭",
      a: "𝗮",
      b: "𝗯",
      c: "𝗰",
      d: "𝗱",
      e: "𝗲",
      f: "𝗳",
      g: "𝗴",
      h: "𝗵",
      i: "𝗶",
      j: "𝗷",
      k: "𝗸",
      l: "𝗹",
      m: "𝗺",
      n: "𝗻",
      o: "𝗼",
      p: "𝗽",
      q: "𝗾",
      r: "𝗿",
      s: "𝘀",
      t: "𝘁",
      u: "𝘂",
      v: "𝘃",
      w: "𝘄",
      x: "𝘅",
      y: "𝘆",
      z: "𝘇",
    };

    return text
      .split("")
      .map((char) => fontMapping[char] || char)
      .join("");
  }

  const kupal = `${formatFont("HUMANIZE TEXT")}:\n\n
- ${result.message}\n\n`;

  api.sendMessage(kupal, event.sender.id);
};

