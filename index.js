const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

fs.readFile("./txt/title.txt", "utf-8", (err, data1) => {
  if (err) return console.log("Error in data1");
  fs.readFile("./txt/home.txt", "utf-8", (err, data2) => {
    if (err) console.log("Error in data2");
    fs.writeFile(
      `./txt/${data1}.txt`,
      `Created file:\n${data2}`,
      "utf-8",
      (err) => {
        if (err) console.log("Error writing file");
      }
    );
  });
});

const tempHome = fs.readFileSync(
  `${__dirname}/templates/template-home.html`,
  "utf-8"
);

const tempTeamsList = fs.readFileSync(
  `${__dirname}/templates/template-teams-list.html`,
  "utf-8"
);
const tempTeam = fs.readFileSync(
  `${__dirname}/templates/template-team.html`,
  "utf-8"
);
const txtQuote = fs.readFileSync(`${__dirname}/txt/NBA.txt`, "utf-8");

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const nbaObj = JSON.parse(data);

const slugs = nbaObj.map((team) => slugify(team.name.at(-1), { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Home page

  if (pathname === "/" || pathname === "/home") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const teamsHtml = nbaObj
      .map((team) => replaceTemplate(tempTeamsList, team))
      .join(" ");
    const output = tempHome
      .replace("{%TEAMSCARDS%}", teamsHtml)
      .replace("{%TXT%}", txtQuote);

    res.end(output);
  }

  // Team page
  else if (pathname === "/team") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const team = nbaObj[query.id];
    const output = replaceTemplate(tempTeam, team);
    res.end(output);
  }

  // Not found
  else {
    res.writeHead(400, { "Content-type": "text/html" });
    res.end("<h1>Page not found</h2>");
  }
});
server.listen(8001, "127.0.0.1", () => {
  console.log(`Listening to request on port 8001`);
});
