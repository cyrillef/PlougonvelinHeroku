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
var socket =null ;

$(document).ready (function () {
	//var socket =io.connect (window.location.protocol + '//' +  window.location.host + ':' + window.location.port) ;
	//socket =io () ;
	//
	//socket.on ('connect', function (data) {
	//	//socket.emit ('join', 'Hello World from client') ;
	//	console.log ('Server connected') ;
	//}) ;
	//
	//socket.on ('disconnect', function () {
	//	console.log ('Server disconnected') ;
	//}) ;
	//
	//socket.on ('refresh', function (data) {
	//	alert ('refresh') ;
	//}) ;
	//
	//socket.on ('roomShutterCommand', function (data) {
	//	alert ('roomShutterCommand') ;
	//}) ;
	//
	//socket.on ('roomCentral', function (data) {
	//	alert ('roomCentral') ;
	//}) ;
	//
	//socket.on ('floorCentral', function (data) {
	//	alert ('floorCentral') ;
	//}) ;

}) ;

// Mac address to uppercase
function macAddress (value) {
	value =value.toLowerCase () ;
	value =value.replace ('-', ':').replace ('.', ':') ;
	return (value) ;
}
