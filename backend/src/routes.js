const express = require('express');
const { createPlaylist, serveHLSPlaylist, createPlaylistInMultiResolution, serveMultiHLSPlaylist } = require('./controller');
const routes = express.Router();

routes.get("/exec/:videoName", createPlaylist)
routes.get("/multi-res-exec/:videoName", createPlaylistInMultiResolution)
routes.get("/video/:videoName", serveHLSPlaylist);
routes.get("/multi-res-video/:videoName", serveMultiHLSPlaylist);

module.exports = routes;
