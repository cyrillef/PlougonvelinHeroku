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
var router =express.Router () ;
var fs =require ('fs') ;
var lmv =require ('./lmv') ;

var housedef =require ('./house-def') ;
var scenario =require ('./scenario') ;

function renderPage (page, obj, req, res) {
	try {
		//var opts ={ compileDebug: true, debug: true, client: true } ;
		res.render (page, obj) ;
	} catch ( err ) {
		res.status (404).end () ;
	}
}

// https://regex101.com/
router.get (/^\/([a-zA-Z0-9\-]*)(\.html)?$/, function (req, res, next) {
	var re =/^\/([a-zA-Z0-9\-]*)(\.html)?$/ ; // req.route.path ;
	var found =req._parsedUrl.pathname.match (re) ;
	if ( found.length < 3 || found [1] === '' ) // default to index.html
		return (renderPage (
			'index',
			{
				'def': housedef,
				'scenarie': scenario.scenarie (),
                'urn': 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTEwOS9DeXJpbGxlX0hvdXNlLnJ2dA==',
                'accessToken': lmv.Lmv.getToken ()
			},
			req, res
		)) ;
	fs.exists ('./views/' + found [1] + '.ejs', function (exists) {
		if ( exists )
			return (renderPage (
				found [1],
				{
					'query': req.query,
					'def': housedef,
					'scenarie': scenario.scenarie (),
					'urn': 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3lyaWxsZS0yMDE1MTEwOS9DeXJpbGxlX0hvdXNlLnJ2dA==',
					'accessToken': lmv.Lmv.getToken ()
				},
				req,
				res
			)) ;
		next () ;
	}) ;
}) ;

module.exports =router ;