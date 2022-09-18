const express = require("express");
const puppeteer = require('puppeteer');
const ejs = require("ejs");
const path = require("path");

const app = express();
const PORT = 3001;

const passengers = require("./data");

app.get("/", (req, res) => {
  ejs.renderFile(path.join(__dirname, "print.ejs"), passengers, (err, data) => {
    if(err) {
      return res.send('Erro na leitura do arquivo');
    }
    return res.send(data);
  });
});

app.get('/pdf', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3001/", {
    waitUntil: "networkidle0"
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: "letter",
    margin: {
      top: "20px",
      bottom: "40px",
      left: "20px",
      right: "20px"
    }
  });

  await browser.close();

  res.contentType("application/pdf");

  return res.send(pdf);
});

app.listen(PORT, () => console.log(`App on! Listen on port ${PORT}.`));
