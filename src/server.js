// Video on Demand Stream over LAN
// CSC 466 Project
//
// @authors:
// Daniel Oon
// Xian

var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

var indexPage, demo_webm, demo_mp4, demo_ogg;

// TODO: Create a database to organize media library.
// Need to assign unique identifiers for each video, somehow. Some hash...
var media_library = "../media/"


// load the video files and the index html page
fs.readFile(path.resolve(__dirname, media_library + "demo.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    demo_mp4 = data;
});

fs.readFile(path.resolve(__dirname, "index.html"), function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});



// TODO: Find transcoder to encode media for streaming
// In order to support video uploading function (or even pushing videos manually), we need a transcoder
// to encode videos for HTML5 streaming (at least: mp4, ogg, webm)


// create http server
http.createServer(function (req, res) {
    
    var reqResource = url.parse(req.url).pathname;
    //console.log("Resource: " + reqResource);

    if(reqResource == "/"){
    
        //console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();

    } else if (reqResource == "/favicon.ico"){
    
        res.writeHead(404);
        res.end();
    
    } else {

            var total;
            if(reqResource == "/demo.mp4"){
                total = demo_mp4.length;
            } //else if(reqResource == media_library + "demo.ogg"){} 
            var range = req.headers.range;

            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            // if last byte position is not present then it is the last byte of the video file.
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end-start)+1;

            if(reqResource == "/demo.mp4"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(demo_mp4.slice(start, end+1), "binary");

            } //else if(reqResource == "demo.ogg"){}
    }
}).listen(8888); 