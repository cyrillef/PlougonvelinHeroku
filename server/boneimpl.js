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
var fs =require ('fs') ;

var DigitalPins =[], AnalogPins =[]/*, LEDs =[]*/ ;
// P8 7-19 / 26-36 - (13) / (11) = 24
// P9 11-18 / 21-27 / 30 / 41-42 - (8) / (7) / (1) / (2) = 18

var init =function () {
	fs.readFile ('./data/DigitalPins.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read DigitalPins definition file')) ;
		DigitalPins =JSON.parse (data) ;
	}) ;
	fs.readFile ('./data/AnalogPins.json', function (err, data) {
		if ( err )
			return (console.log ('Cannot read AnalogPins definition file')) ;
		AnalogPins =JSON.parse (data) ;
	}) ;
	//fs.readFile ('./data/LEDs.json', function (err, data) {
	//	if ( err )
	//		return (console.log ('Cannot read LEDs definition file')) ;
	//	LEDs =JSON.parse (data) ;
	//}) ;
} ;
init () ;

var digitalPinsDef =function (digitalPins) {
	if ( JSON.stringify (DigitalPins) === JSON.stringify (digitalPins) )
		return (false) ;
	DigitalPins =digitalPins ;
	fs.writeFile ('./data/DigitalPins.json', JSON.stringify (digitalPins), function (err) {
		if ( err )
			return (console.log ('Cannot write DigitalPins definition file')) ;
	}) ;
	return (true) ;
} ;

var analogPinsDef =function (analogPins) {
	if ( JSON.stringify (AnalogPins) === JSON.stringify (analogPins) )
		return (false) ;
	AnalogPins =analogPins ;
	fs.writeFile ('./data/AnalogPins.json', JSON.stringify (analogPins), function (err) {
		if ( err )
			return (console.log ('Cannot write AnalogPins definition file')) ;
	}) ;
	return (true) ;
} ;

module.exports ={
	'DigitalPins': function () { return (DigitalPins) ; },
	'AnalogPins': function () { return (AnalogPins) ; },
	//'LEDs': function () { return (LEDs) ; }

	'digitalPinsDef': digitalPinsDef,
	'analogPinsDef': analogPinsDef
} ;
