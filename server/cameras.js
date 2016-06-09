//
// Copyright (c) Cyrille Fauvel, Inc. All rights reserved
//
// Node.js server workflow
// by Cyrille Fauvel
// September 2015
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// Cyrille Fauvel PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// Cyrille Fauvel SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  Cyrille Fauvel
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
//
var express =require ('express') ;
var request =require ('request') ;
var rtsp =require ('node-rtsp-stream') ;
//var stream =require ('stream') ;
//var rtsp =require ('rtsp-ffmpeg') ;
//var childp =require ('child_process') ;

//var FI9903P =new stream.Stream ({
//	name: 'FI9903P',
//	streamUrl: 'rtsp://cyrille:tZxuigo0@192.168.1.56:88/videoMain',
//	wsPort: 8002
//}) ;

// opt1
//var FI9903P =new rtsp.FFMpeg ({
//	input: 'rtsp://cyrille:tZxuigo0@192.168.1.56:88/videoMain',
//	rate: 10,
//	resolution: '640x360',
//	quality: 3
//}) ;

//var FI9903P ='rtsp://cyrille:tZxuigo0@192.168.1.56:88/videoMain' ;

// Opt2
//var FI9903P =function () {
//	return (childp.spawn ("./server/ffmpeg", [
//		"-re",
//		//	"-threads", 4,
//		"-y",
//		"-i",
//		'rtsp://cyrille:tZxuigo0@192.168.1.56:88/videoMain', // videoSub
//		"-preset",
//		"ultrafast",
//		//	"-bufsize", "702000k", "-vcodec", "-copy",
//		"-f",
//		"mjpeg",
//		"pipe:1"
//	])) ;
//} ;
var FI9903P ={} ;

module.exports ={
	'FI9903P': FI9903P
} ;
