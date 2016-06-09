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
var fs =require ('fs') ;
var boneimpl =require ('./boneimpl') ;

var floors ={}, rooms ={}, viewer ={}, sensors ={}, cameras ={} ;

var init =function () {
	fs.readFile ('./data/floors.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read floors definition file')) ;
		floors =JSON.parse (data) ;
		var rooms2 =Object.keys (floors).map (function (k) { return (floors [k]) ; }) ;
		rooms2 =[].concat.apply ([], [].concat.apply ([], rooms2)) ;
		rooms2 =rooms2.filter (function (item, i, ar) { return (ar.indexOf (item) === i) ; }) ;
		rooms =rooms2.reduce (function (previousValue, value, index) { previousValue [value] =[] ; return (previousValue) ; }, {}) ;

		for ( var room in rooms ) {
			var roomLoad =function (roomName) {
				var roomid =roomName.replace (/\W/g, '') ;
				fs.readFile (
					'./data/' + roomid + '.json',
					function (err, buffer) {
						if ( err )
							return ;
						rooms [roomName] =JSON.parse (buffer) ;
					}) ;
			} ;
			roomLoad (room) ;
		}
	}) ;

    fs.readFile ('./data/viewer.json', function (err, data) {
        if ( err )
            return (console.log ('Cannot read viewer definition file')) ;
        viewer =JSON.parse (data) ;
    }) ;

    fs.readFile ('./data/sensors.json', function (err, data) {
        if ( err )
            return (console.log ('Cannot read sensors definition file')) ;
        sensors =JSON.parse (data) ;
    }) ;

	fs.readFile ('./data/cameras.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read cameras definition file')) ;
		cameras =JSON.parse (data) ;
	}) ;

} ;
init () ;

var floorsDef =function (data) {
	if ( JSON.stringify (floors) === JSON.stringify (data) )
		return (false) ;
	floors =data ;
	fs.writeFile ('./data/floors.json', JSON.stringify (data), function (err) {
		if ( err )
			return (console.log ('Cannot write floors definition file')) ;
	}) ;
	return (true) ;
} ;

var viewerDef =function (data) {
    if ( JSON.stringify (viewer) === JSON.stringify (data) )
        return (false) ;
    viewer =data ;
    fs.writeFile ('./data/viewer.json', JSON.stringify (data), function (err) {
        if ( err )
            return (console.log ('Cannot write viewer definition file')) ;
    }) ;
    return (true) ;
} ;

var sensorsDef =function (data) {
    if ( JSON.stringify (sensors) === JSON.stringify (data) )
        return (false) ;
    sensors =data ;
    fs.writeFile ('./data/sensors.json', JSON.stringify (data), function (err) {
        if ( err )
            return (console.log ('Cannot write sensors definition file')) ;
    }) ;
    return (true) ;
} ;

var camerasDef =function (data) {
	if ( JSON.stringify (cameras) === JSON.stringify (data) )
		return (false) ;
	cameras =data ;
	fs.writeFile ('./data/cameras.json', JSON.stringify (data), function (err) {
		if ( err )
			return (console.log ('Cannot write cameras definition file')) ;
	}) ;
	return (true) ;
} ;

module.exports ={
	'DigitalPins': boneimpl.DigitalPins,
	'floors': function () { return (floors) ; },
	'rooms': function () { return (rooms) ; },
    'viewer': function () { return (viewer) ; },
    'sensors': function () { return (sensors) ; },
	'cameras': function () { return (cameras) ; },

	'digitalPinsDef': boneimpl.digitalPinsDef,
	'floorsDef': floorsDef,
	'roomsDef': function (data) { return (rooms =data, false) ; },
    'viewerDef': viewerDef,
    'sensorsDef': sensorsDef,
	'camerasDef': camerasDef
} ;
