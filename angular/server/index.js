const fs = require("fs");
const path = require("path");
const jsonServer = require("json-server");

const API_PREFIX = "/api";
const COMMENT_ORIGINAL_DATA_PATH = path.join(
  __dirname,
  "data",
  "comments_original.json"
);
const DB_FILENAME = "db.json";
const DB_JSON_PATH = path.join(__dirname, "data", DB_FILENAME);
const PORT = process.env.PORT || 3001;

const REQUIRED_COMMENT_FIELDS = ["text"];

const server = jsonServer.create();
const router = jsonServer.router(DB_JSON_PATH);
const middlewares = jsonServer.defaults();

const getErrorResponse = error => ({ error });

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  // Validate on comment creation
  if (req.method === "POST" && req.originalUrl === "/api/comments") {
    const invalidFields = REQUIRED_COMMENT_FIELDS.filter(field => {
      return req.body[field] === undefined;
    });

    if (invalidFields.length > 0) {
      const invalidFieldsStr = invalidFields
        .map(field => `"${field}"`)
        .join(", ");
      return res
        .status(400)
        .send(
          getErrorResponse(
            `Missing the following required fields: [${invalidFieldsStr}]`
          )
        );
    }
  }

  next();
});

// Reset comments to original state
server.post(`${API_PREFIX}/reset-comments`, (req, res) => {
  const commentsJson = JSON.parse(fs.readFileSync(COMMENT_ORIGINAL_DATA_PATH));
  fs.writeFileSync(
    DB_JSON_PATH,
    JSON.stringify({ comments: commentsJson }, null, 2),
    "utf8"
  );

  return res.status(204).send();
});

server.get(`${API_PREFIX}/comments`, (req, res) =>  {
  const commentsJson = JSON.parse(fs.readFileSync(DB_JSON_PATH))
  return res.status(200).send({
    data : commentsJson.comments
  });
})

server.post(`${API_PREFIX}/comments`, (req, res) =>  {
  const comment = JSON.parse(fs.readFileSync(DB_JSON_PATH))
  fs.writeFileSync(
    DB_JSON_PATH,
    JSON.stringify({ comments: [...comment, req.body] }),
    "utf8"
  );
  comment = JSON.parse(fs.readFileSync(DB_JSON_PATH))
  return res.status(200).send({
    data : comment.comments
  });
})

// Prefix all routes with `/api/`
server.use(API_PREFIX, router);
return server.listen(PORT, () => {
  console.log(`JSON server listening http://localhost:${PORT}`);
});
