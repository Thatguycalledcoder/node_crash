const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const server = http.createServer(async (req, res) => {
    const filename = (req.url === "/" ? "index.html" : req.url);
    const filepath = path.join(__dirname, "public", filename);
    let content_type = "text/html";
    const extension = path.extname(filename);

    switch (extension) {
        case ".txt":
            content_type = "text/plain";
            break;
        default:
            break;
    }

    try {
        const data = await fs.readFile(filepath, "utf8");
        res.statusCode = 200;
        res.setHeader('Content-Type', content_type);
        res.write(data);
        res.end();
    } catch(e) {
        if (e.code === "ENOENT") {
            res.statusCode = 404; 
        }
        else {
            res.statusCode = 500;
        }
        res.setHeader("Content-Type", "text/html");
        const error_path = path.join(__dirname, "public", "404.html");
        const content = await fs.readFile(error_path, "utf8");
        res.write(content);
        res.end();
    }
});