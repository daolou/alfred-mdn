"use strict";

const alfy = require("alfy");
const mdnDocBase = "https://developer.mozilla.org";
const locale = process.env.locale || 'en-US';

https: alfy
  .fetch(`${mdnDocBase}/api/v1/search?q=${alfy.input}&locale=${locale}`, { transform })
  .then((results) => {
    const items = (results || []).map((result) => {
      const { title, highlight, mdn_url } = result;
      const excerpt =
        highlight && highlight.body && highlight.body.length > 0
          ? highlight.body[0]
          : "";
      const subtitle = stripHtml(excerpt);
      const url = `${mdnDocBase}${mdn_url}`;

      return {
        title,
        subtitle,
        autoComplete: title,
        arg: url,
        quicklookurl: url,
      };
    });

    // No results
    if (items.length === 0) {
      const url = `${mdnDocBase}/${locale}/search?q=${alfy.input}`;

      items.push({
        title: `Show all results for '${alfy.input}'`,
        arg: url,
        quicklookurl: url,
      });
    }

    alfy.output(items);
  });

function transform(body) {
  return body.documents;
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, "").replace(/&(?:amp|gt|lt|quot|#\d{2,5}|#x[\da-fA-F]{2,4});/g, "");
}
