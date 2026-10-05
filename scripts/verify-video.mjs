import { assertVideo, probeVideo } from '../src/video/ffmpeg.mjs';

const [videoPath = 'output/preview.mp4', width = '1080', height = '1920', duration = '1'] = process.argv.slice(2);
const probe = await probeVideo(videoPath);
assertVideo(probe, { width: Number(width), height: Number(height), duration: Number(duration), fps: 12 });
console.log('動画検証成功:', JSON.stringify(probe));
