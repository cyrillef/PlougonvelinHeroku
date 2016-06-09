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
var schedule =require ('node-schedule') ;
var unirest =require ('unirest') ;

// *     *     *     *    *     *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

var scenarie ={
	'Ete': {
		'00 09 * * *': '/floor/Maison/open',
		'30 22 * * *': '/floor/Maison/close',

		'*/15 * * * * *': '/floor/Bureau/Nord/close'
		//'30 10 * * *': '/shutter/Lucille/Est/close',
		//'30 13 * * *': '/shutter/Pauline/Sud/close',
		//'30 13 * * *': '/shutter/Lucille/Ouest/open',
		//'00 14 * * *': '/shutter/Pauline/Ouest/close',
		//'00 14 * * *': '/shutter/Marie/Ouest/close',
		//'30 14 * * *': '/shutter/Salon/Ouest/half'
	},
	'Hiver': {
		'05 09 * * *': '/floor/Maison/open',
		'30 19 * * *': '/floor/Maison/close'
	},
	'Vacances': {
		'08 09 * * 1': '/floor/Maison/open',
		'32 21 * * 1': '/floor/Maison/close',
		'17 09 * * 2': '/floor/Maison/open',
		'47 21 * * 2': '/floor/Maison/close',
		'03 09 * * 3': '/floor/Maison/open',
		'02 21 * * 3': '/floor/Maison/close',
		'53 08 * * 4': '/floor/Maison/open',
		'03 22 * * 4': '/floor/Maison/close',
		'08 09 * * 5': '/floor/Maison/open',
		'31 21 * * 5': '/floor/Maison/close',
		'05 09 * * 6': '/floor/Maison/open',
		'33 22 * * 6': '/floor/Maison/close',
		'05 10 * * 7': '/floor/Maison/open',
		'30 21 * * 7': '/floor/Maison/close'
	}
} ;

var scenario =(function () {

	function scenario () {
		this.jobs =[] ;
		this.name ='Aucun' ;
	}

	scenario.prototype.cancel =function () {
		for ( var i =0 ; i < this.jobs.length ; i++ )
			this.jobs [i].cancel () ;
		this.jobs =[] ;
		this.name ='Aucun' ;
	} ;

	scenario.prototype.setMode =function (defname) {
		this.cancel () ;
		if ( !scenarie.hasOwnProperty (defname) )
			return ;
		this.name =defname ;
		for ( var sc in scenarie [defname] )
			this.addToSchedule (sc, scenarie [defname] [sc]) ;
	} ;

	scenario.prototype.addToSchedule =function (def, cmd) {
		this.jobs.push (
			schedule.scheduleJob (def, function () {
				console.log ('Sending: ' + def + ' - ' + cmd) ;
				unirest.get ('http://127.0.0.1:8001' + cmd)
					.end (function (response) {
						if ( response.statusCode != 200 )
							console.log ('Error' + response.statusCode + ': ' + def + ' - ' + cmd) ;
					})
				;
			})
		) ;
	} ;

	scenario.scenarie =function () {
		return (scenarie) ;
	} ;

	return (scenario) ;
}) () ;

module.exports =scenario ;