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
var bodyParser =require ('body-parser') ;
var favicon =require ('serve-favicon') ;
var async =require ('async') ;
var io =require ('socket.io') ;
var boneimpl =require ('./boneimpl') ;

// http://garann.github.io/template-chooser/
var app =express () ;
app.use (bodyParser.urlencoded ({ extended: false })) ;
app.use (bodyParser.json ()) ;
//app.use (logger ('dev')) ;
app.use (favicon (__dirname + '/../www/favicon.ico')) ;
app.use (express.static (__dirname + '/../www')) ;
app.set ('view engine', 'ejs') ;
app.use ('/', require ('./pages')) ;
//app.use (require ('./errors')) ;
var lmvToken =require ('./lmv-token') ;

var httpServer =require ('http').createServer (app) ;
var ioServer =io (httpServer) ;

//- Commands
var housedef =require ('./house-def') ;

app.get ('/room/:roomid/:nameid/:cmd', function (req, res) {
	ioServer.sockets.emit (
		'roomShutterCommand',
		{
			roomid: req.params.roomid,
			nameid: req.params.nameid,
			cmd: req.params.cmd
		}
	) ;
	res.end () ;
}) ;

app.get ('/room/:roomid/:cmd', function (req, res) {
	ioServer.sockets.emit (
		'roomCentral',
		{
			roomid: req.params.roomid,
			cmd: req.params.cmd
		}
	) ;
	res.end () ;
}) ;

app.get ('/floor/:floorid/:cmd', function (req, res) {
	ioServer.sockets.emit (
		'floorCentral',
		{
			floorid: req.params.floorid,
			cmd: req.params.cmd
		}
	) ;
	res.end () ;
}) ;

//- IO
var bbb =null ;

ioServer.on ('connection', function (socket) {
	console.log ('New Client connected...') ;
	console.log ("Total clients connected: " + socket.server.sockets.sockets.length) ;

	socket.on ('definitions', function (data) {
		console.log ('received definition updates, bbb server connected') ;
		bbb =socket ;
		socket.broadcast.emit ('bbbOn', null) ;
		if (   housedef.digitalPinsDef (data.DigitalPins)
			|| housedef.floorsDef (data.floors)
			|| housedef.roomsDef (data.rooms)
            || housedef.viewerDef (data.viewer)
            || housedef.sensorsDef (data.sensors)
			|| housedef.camerasDef (data.cameras)
		) {
			// Tell all client the definition changed
			socket.broadcast.emit ('refresh', null) ; // Sends a message to everyone except the socket that starts it
		}
	}) ;

	socket.on ('disconnect', function (ss) {
		console.log ('Client disconnected') ;
		console.log ("Total clients connected: " + socket.server.sockets.sockets.length) ;
		if ( socket === bbb ) {
			console.log ('bbb disconnected') ;
			socket.broadcast.emit ('bbbOff', null) ;
			bbb =null ;
		}
		// If no more sockets
		if ( socket.server.sockets.sockets.length == 0 ) {
		}
	}) ;

	socket.on ('bbbStatus', function (ss) {
		socket.emit (bbb !== null ? 'bbbOn' : 'bbbOff', null) ;
	}) ;

	socket.on ('roomShutterCommand', function (data) {
		console.log ('roomShutterCommand') ;
		//socket.broadcast.emit ('roomShutterCommand', data) ;
		ioServer.sockets.emit ('roomShutterCommand', data) ;
	}) ;

	socket.on ('roomCentral', function (data) {
		console.log ('roomCentral') ;
		//socket.broadcast.emit ('roomCentral', data) ;
		ioServer.sockets.emit ('roomCentral', data) ;
	}) ;

	socket.on ('floorCentral', function (data) {
		console.log ('floorCentral') ;
		//socket.broadcast.emit ('floorCentral', data) ;
		ioServer.sockets.emit ('floorCentral', data) ;
	}) ;

	socket.on ('roomShutterCommandCompleted', function (data) {
		console.log ('roomShutterCommandCompleted') ;
		socket.broadcast.emit ('roomShutterCommandCompleted', data) ;
	}) ;

	socket.on ('roomCentralCompleted', function (data) {
		console.log ('roomCentralCompleted') ;
		socket.broadcast.emit ('roomCentralCompleted', data) ;
	}) ;

	socket.on ('floorCentralCompleted', function (data) {
		console.log ('floorCentralCompleted') ;
		socket.broadcast.emit ('floorCentralCompleted', data) ;
	}) ;

    socket.on ('sensorData', function (data) {
        //console.log ('sensorData') ;
        socket.broadcast.emit ('sensorData', data) ;
    }) ;

}) ;

// Scenario
var scenario =require ('./scenario') ;
var activeScenario =new scenario () ;
//activeScenario.setMode ('Ete') ;

app.get ('/scenario/:name', function (req, res) {
	var name =req.params.name ;
	console.log ('Scenario ' + name + ' active') ;
	activeScenario.setMode (name) ;
	res.end () ;
}) ;

app.set ('port', process.env.PORT || 8002) ;

module.exports ={
	'express': app,
	'httpServer': httpServer,
	'io': io
} ;
