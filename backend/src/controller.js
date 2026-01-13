const path = require("path");
const { exec } = require('child_process');
const fs = require('fs');
const { masterPlaylist } = require("../helpers/constant");

const createPlaylist = async (req, res) => {
    try {
        const videoName = req.params.videoName;
        const mp4Path = path.join(__dirname, "../videos", `${videoName}.mp4`);
        if (!mp4Path) {
            return res.status(400).send("Video file not found")
        }

        const m3u8OutputDir = path.join(__dirname, "../videos", `${videoName}_hls`);
        if (!fs.existsSync(m3u8OutputDir)) {
            fs.mkdirSync(m3u8OutputDir);
        }

        // FFmpeg command to convert .mp4 to .m3u8
        // const ffmpegPath = 'C:/ffmpeg/bin/ffmpeg';
        // const ffmpegCommand = `"${ffmpegPath}" -i ${mp4Path} -c:v libx264 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "${m3u8OutputDir}/segment%03d.ts" ${m3u8OutputDir}/playlist.m3u8`;

        const ffmpegCommand = `ffmpeg -i ${mp4Path} -c:v libx264 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "${m3u8OutputDir}/segment%03d.ts" ${m3u8OutputDir}/playlist.m3u8`;

        await exec(ffmpegCommand, (err, stdout, stderr) => {
            if (err) {
                console.error('Error executing FFmpeg command:', err);
                return res.status(500).send('Error converting video to HLS format');
            }

            // Log output from FFmpeg
            console.log('FFmpeg Output:', stdout);
            console.error('FFmpeg Error Output:', stderr);

            // After successful conversion, serve the m3u8 file
            return res.status(200).send('execution completed and playlist is ready to serve');
        });
    } catch (error) {
        console.error('Error during conversion:', error);
        return res.status(500).send('Error during video conversion.');
    }
}

//! TODO: Handle multiresolution video streaming (adaptive birate streaming)
const createPlaylistInMultiResolution = async (req, res) => {
    try {
        const videoName = req.params.videoName;
        const mp4Path = path.join(__dirname, "../videos", `${videoName}.mp4`);
        if (!mp4Path) {
            return res.status(400).send("Video file not found")
        }

        const m3u8OutputDir = path.join(__dirname, "../videos", `${videoName}_adpt_hls`);
        if (!fs.existsSync(m3u8OutputDir)) {
            fs.mkdirSync(m3u8OutputDir);
        }

        const resolutions = ['360p', '480p', '720p'];
        resolutions.forEach(resolution => {
            const resolutionDir = path.join(m3u8OutputDir, resolution);
            if (!fs.existsSync(resolutionDir)) {
                fs.mkdirSync(resolutionDir, { recursive: true }); // Ensure the directory is created
            }
        });

        const ffmpegCommand = `ffmpeg -i ${mp4Path} \
            -filter_complex "[0:v]split=3[v360p][v480p][v720p]" \
            -map "[v360p]" -c:v:0 libx264 -b:v:0 500k -s 640x360 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "${m3u8OutputDir}/360p/segment%03d.ts" ${m3u8OutputDir}/360p/playlist.m3u8 \
            -map "[v480p]" -c:v:1 libx264 -b:v:1 1000k -s 854x480 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "${m3u8OutputDir}/480p/segment%03d.ts" ${m3u8OutputDir}/480p/playlist.m3u8 \
            -map "[v720p]" -c:v:2 libx264 -b:v:2 2500k -s 1280x720 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "${m3u8OutputDir}/720p/segment%03d.ts" ${m3u8OutputDir}/720p/playlist.m3u8
        `

        await exec(ffmpegCommand, (err, stdout, stderr) => {
            if (err) {
                console.error('Error executing FFmpeg command:', err);
                return res.status(500).send('Error converting video to HLS format');
            }

            // Log output from FFmpeg
            console.log('FFmpeg Output:', stdout);
            console.error('FFmpeg Error Output:', stderr);

            // Create master playlist for adaptive bitrate streaming
            const masterPlaylistPath = path.join(m3u8OutputDir, 'master.m3u8');
            fs.writeFileSync(masterPlaylistPath, masterPlaylist, 'utf8');


            // After successful conversion, serve the m3u8 file
            return res.status(200).send('execution completed and playlist is ready to serve');
        });
    } catch (error) {
        console.error('Error during conversion:', error);
        return res.status(500).send('Error during video conversion.');
    }
}

const serveHLSPlaylist = async (req, res) => {
    try {
        const videoName = req.params.videoName;
        const m3u8OutputDir = path.join(__dirname, "../videos", `${videoName}_hls`);

        if (!fs.existsSync(m3u8OutputDir)) {
            return res.status(404).send("Video playlist not found")
        }

        const m3u8FileUrl = `videos/hls/${videoName}_hls/playlist.m3u8`;
        return res.status(200).send(m3u8FileUrl);
    } catch (error) {
        console.error('get playlist error:', error);
        return res.status(500).send('Internal server error');
    }
}

const serveMultiHLSPlaylist = async (req, res) => {
    try {
        const videoName = req.params.videoName;
        const m3u8OutputDir = path.join(__dirname, "../videos", `${videoName}_adpt_hls`);

        if (!fs.existsSync(m3u8OutputDir)) {
            return res.status(404).send("Video playlist not found")
        }

        const m3u8FileUrl = `videos/hls/${videoName}_adpt_hls/master.m3u8`;
        return res.status(200).send(m3u8FileUrl);
    } catch (error) {
        console.error('get playlist error:', error);
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    createPlaylist,
    createPlaylistInMultiResolution,
    serveHLSPlaylist,
    serveMultiHLSPlaylist
};