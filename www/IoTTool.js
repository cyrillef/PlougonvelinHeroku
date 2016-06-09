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
'use strict' ;

AutodeskNamespace ('Autodesk.Viewing.Extensions.IoT') ;

// IoT Extension
Autodesk.Viewing.Extensions.IoTExtension =function (viewer, options) {
	Autodesk.Viewing.Extension.call (this, viewer, options) ;
} ;

Autodesk.Viewing.Extensions.IoTExtension.prototype =Object.create (Autodesk.Viewing.Extension.prototype) ;
Autodesk.Viewing.Extensions.IoTExtension.prototype.constructor =Autodesk.Viewing.Extensions.IoTExtension ;

Autodesk.Viewing.Extensions.IoTExtension.prototype.load =function () {
	var self =this ;
	var _viewer =this.viewer ;
    var _toolbar =this.viewer.getToolbar (true) ;

	// Register tool
	this.tool =new Autodesk.Viewing.Extensions.IoTTool (_viewer, this) ;
	_viewer.toolController.registerTool (this.tool) ;

	// Add the ui to the viewer.
	if ( _toolbar ) {
		var navTools =_toolbar.getControl (Autodesk.Viewing.TOOLBAR.NAVTOOLSID) ;
		if ( navTools && navTools.getNumberOfControls () > 0 )
			onToolbarCreated () ;
		else
			_viewer.addEventListener (Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
	} else {
		_viewer.addEventListener (Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated) ;
	}

	function onToolbarCreated () {
		_viewer.removeEventListener (Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated) ;
		self.createUI (_toolbar) ;
	}

    // Detect Tool change status
    /*this.onToolChanged =function (e) {
       if (e.toolName.indexOf ('Autodesk.IoT') === -1 )
           return ;
        var state =e.active ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE ;
        self.IoTToolButton.setState (state) ;
    } ;
    _viewer.addEventListener (Autodesk.Viewing.TOOL_CHANGE_EVENT, this.onToolChanged) ;*/

	return (true) ;
} ;

Autodesk.Viewing.Extensions.IoTExtension.prototype.createUI =function (toolbar) {
	var self =this ;
	var viewer =this.viewer ;
	try {
        this.ioTToolGroup =new Autodesk.Viewing.UI.ControlGroup ('IoTGroupTools') ;
        this.ioTToolButton =new Autodesk.Viewing.UI.Button ('IoTTool') ;
        this.ioTToolButton.setIcon ("adsk-icon-IoT") ;
        this.ioTToolButton.setToolTip ("IoT Tool") ;
        this.ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.INACTIVE) ;
        var ioTToolButton =this.ioTToolButton ;
        this.ioTToolButton.onClick =function (e) {
            var state =ioTToolButton.getState () ;
            if ( state === Autodesk.Viewing.UI.Button.State.INACTIVE ) {
                ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.ACTIVE) ;
                viewer.setActiveNavigationTool ('IoT') ;
            } else if ( state === Autodesk.Viewing.UI.Button.State.ACTIVE ) {
                ioTToolButton.setState (Autodesk.Viewing.UI.Button.State.INACTIVE) ;
                viewer.setActiveNavigationTool () ;
            }
        } ;
        this.ioTToolGroup.addControl (this.ioTToolButton, { index: 0 }) ;
        toolbar.addControl (this.ioTToolGroup) ;
	} catch ( e ) {
 	}
} ;

Autodesk.Viewing.Extensions.IoTExtension.prototype.unload =function () {
    var self =this ;

    // Remove onToolChanged event
	//this._viewer.removeEventListener (Autodesk.Viewing.TOLL_CHANGE_EVENT, this.onToolChanged) ;

    // Remove hotkey
    Autodesk.Viewing.theHotkeyManager.popHotkeys (this.HOTKEYS_ID) ;

	// Remove the UI
	var toolbar =this.viewer.getToolbar (false) ;
	if ( toolbar )
        this.viewer.getControl (Autodesk.Viewing.TOOLBAR.NAVTOOLSID).removeControl (this.ioTToolButton.getId ()) ;
    this.ioTToolGroup =null ;
	this.ioTToolButton =null ;

	// Deregister tool
    this.viewer.toolController.deregisterTool (this.tool) ;
	this.tool =null ;

	return (true) ;
} ;

Autodesk.Viewing.theExtensionManager.registerExtension ('Autodesk.IoT', Autodesk.Viewing.Extensions.IoTExtension) ;


// IoT Tool
Autodesk.Viewing.Extensions.IoTTool =function (viewer, IoTExtension) {
	var _self =this ;

	var _viewer =viewer ; this.viewer =function () { return (_viewer) ; } ;
	var _navapi =viewer.navigation ; this.navapi =function () { return (_navapi) ; } ;
	var _container =$(viewer.container) ; this.container =function () { return (_container) ; } ;
	var _camera =_navapi.getCamera () ; this.camera =function () { return (_camera) ; } ;
	var _names =[ 'IoT' ] ;

	var _isActive =false ;
    var _clock =new THREE.Clock (true) ;
    var _wasPerspective =_camera.isPerspective ;
    var _previousFov =_camera.fov ;
    var _scale =_camera.scale.clone () ; this.scale =function () { return (_scale) ; } ;

    var _sensorPanelRenderer =new THREE.CSS3DRenderer () ; // CSS3D Renderer
    var _sensorPanels ={} ; this.sensorPanels =function () { return (_sensorPanels) ; } ;
    //this.shutterLinkedObj
    //this.houseNavigationMenu
    //this.shutterMenu

	this.update =function (timeStamp) {
        //requestAnimationFrame (this.update) ;
        //_sensorPanelRenderer.render (this.sensorPanels.scene (), this.camera ()) ;
        Object.keys (_sensorPanels).map (function (sensorid) {
            _sensorPanelRenderer.render (_sensorPanels [sensorid].scene (), _camera) ;
            return ;
        }) ;
        //controls.update () ;
	} ;

	// ToolInterface
	this.isActive =function () {
		return (_isActive) ;
	} ;

	this.getNames =function () {
		return (_names) ;
	} ;

	this.getName =function () {
		return (_names [0]) ;
	} ;

	this.activate =function (name) {
		if ( _isActive )
			return ;
        _isActive =true ;

        // CSS3D Renderer
        _sensorPanelRenderer.setSize (_container.outerWidth (), _container.outerHeight ()) ;
        $(_sensorPanelRenderer.domElement)
            .css ('position', 'absolute')
            .css ('top', '0px')
            .css ('z-index', 1)
            .css ('pointer-events', 'none')
            .appendTo (_container) ;

        _clock.start () ;

        _wasPerspective =_camera.isPerspective ;
        _navapi.toPerspective () ;

        _previousFov =_camera.fov ;
        _navapi.setVerticalFov (75, true) ;

		// Calculate a movement scale factor based on the model bounds (ignore selection).
		var boundsSize =_viewer.utilities.getBoundingBox (true).size () ;
		//_modelScaleFactor =Math.max (Math.min (Math.min (boundsSize.x, boundsSize.y), boundsSize.z) / 100.0, 1.0) ;

		//this.resetPointerTracking () ;

		// HACK: Attempt to place focus in canvas so we get key events.
		_viewer.canvas.focus () ;

        if ( this.houseNavigationMenu === undefined ) {
            this.createHouseNavigationMenu () ;
            this.createSensorMarkers () ;
        }

        this.shutterLinkedObj =shuttersDbIdsLinks (viewerCameras) ;
        _viewer.addEventListener (Autodesk.Viewing.SELECTION_CHANGED_EVENT, $.proxy (this.onItemSelected, this)) ;
        _viewer.addEventListener (Autodesk.Viewing.CAMERA_CHANGE_EVENT, $.proxy (this.onCameraChanged, this)) ;
		_viewer.addEventListener (Autodesk.Viewing.VIEWER_RESIZE_EVENT, $.proxy (this.onViewportSizeChanged, this)) ;

        /* todo for testing */
        //var sensorid ='c4be8471058b' ;
        //sensorid ='c4be84706d89' ;
        //var sensor =sensors [sensorid] ;
        //
        //this.navigate (sensor ['viewfrom'], sensor ['position']) ;
        //_sensorPanels [sensorid] =new Autodesk.Viewing.Extensions.IoTTool.SensorPanel (sensorid, _self) ;
        //_sensorPanels [sensorid].initializeFeeds () ;
        //this.activateSensorPanel (_sensorPanels [sensorid]) ;
    } ;

	this.deactivate =function (name) {
		if ( !_isActive )
			return ;
		_isActive =false ;

        _viewer.removeEventListener (Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onItemSelected) ;
        _viewer.removeEventListener (Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChanged) ;
		_viewer.removeEventListener (Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewportSizeChanged) ;

        _clock.stop () ;
		//showUIElements (true) ;
	} ;

	this.getCursor =function () {
        return ("url(data:image/png;base64,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), auto") ;
	} ;

    this.navigate =function (position, target) {
        _navapi.setTarget (new THREE.Vector3 ().copy (target)) ;
        _navapi.setPosition (new THREE.Vector3 ().copy (position)) ;
        _camera.zoom =1.0 ;
        _navapi.orientCameraUp () ;
        _viewer.select ([]) ;
    } ;

    this.createHouseNavigationMenu =function () {
        var self =this ;
        this.houseNavigationMenu =this.createRadialMenu (
            rooms,
            '/images/menu.png',
            function (evt) {
                evt.preventDefault () ;
                toggleOptions ($(this).parent ().parent ().parent ()) ;
                var roomid =$(this).attr ('for') ;
                var roomKey =Object.keys (rooms).filter (function (rkey) { return (rkey.replace (/\W/g, '') === roomid) ; }) [0] ;
                var cameraDef =viewerCameras [roomKey] ;
                self.navigate (cameraDef ['position'], cameraDef ['target']) ;
            }
        ) ;
    } ;

    this.createShutterMenu =function (shutter) {
        var self =this ;
        if ( this.shutterMenu !== undefined )
            this.shutterMenu.remove () ;
        this.shutterMenu =this.createRadialMenu (
            shutter,
            '/images/shutter.png',
            function (evt) {
                evt.preventDefault () ;

                var label =$(evt.target) ;
                var ids =label.attr ('for').split ('-') ;
                if ( ids.length == 1 ) {
                    switch ( ids [0] ) {
                        case 'home':
                            self.shutterMenu.remove () ;
                            delete self.shutterMenu ;
                            self.navapi ().setRequestHomeView (true) ;
                            self.viewer ().select ([]) ;
                            self.activateRoomNavigation () ;
                            break ;
                        case 'unselect':
                            self.viewer ().select ([]) ;
                        case 'close':
                            toggleOptions ($(this).parent ().parent ().parent ()) ;
                            break ;
                    }
                    return ;
                }

                var msg ='roomCentral' ;
                var data ={
                    roomid: ids [0],
                    cmd: ids [ids.length - 1]
                } ;
                if ( ids.length >= 3 ) {
                    msg ='roomShutterCommand' ;
                    data.nameid =ids [1] ;
                }
                socket.emit (msg, data) ;
            },
            false
        ) ;
        return (this.shutterMenu) ;
    } ;

    this.createRadialMenu =function (menudef, img, clickCB, bConvert) {
        var self =this ;
        bConvert =(bConvert == undefined ? true : bConvert) ;
        var menu =$(document.createElement ('div'))
            .attr ('class', 'menu-selector-inviewer')
            .attr ('id', guid ())
            .css ('width', _container.outerWidth ()).css ('height', _container.outerHeight ())
            .css ('position', 'absolute').css ('top', '0px').css ('left', '0px')
            .css ('background-color', 'transparent')
            .css ('pointer-events', 'none')
            .appendTo (_container) ;
        var s =$(document.createElement ('div')).attr ('class', 'menu-selector').appendTo (menu) ;
        var ul =$(document.createElement ('ul')).appendTo (s) ;
        if ( menudef.constructor === Array )
            $.each (menudef, function (key, value) {
                var id =value.replace (/\W/g, '') ;
                var li =$(document.createElement ('li')).appendTo (ul) ;
                var input =$(document.createElement ('input')).attr ('id', id).attr ('type', 'checkbox').appendTo (li) ;
                $(document.createElement ('label')).attr ('for', id).text (value).appendTo (li).click (clickCB) ;
            }) ;
        else
            $.each (menudef, function (key, value) {
                var id =bConvert ? key.replace (/\W/g, '') : key ;
                var li =$(document.createElement ('li')).appendTo (ul) ;
                var input =$(document.createElement ('input')).attr ('id', id).attr ('type', 'checkbox').appendTo (li) ;
                $(document.createElement ('label')).attr ('for', id).text (typeof value === 'string' ? value : key).appendTo (li).click (clickCB) ;
            }) ;
        var b =$(document.createElement ('button')).appendTo (s)
            .click (function (e) {
                toggleOptions ($(this).parent ()) ;
            }) ;
        $(document.createElement ('img')).attr ('src', img).appendTo (b) ;
        return (menu) ;
    } ;

    this.onItemSelected =function (evt) {
        var self =this ;

        console.log (evt.dbIdArray [0]) ;

        //var a =viewer.impl.getRenderProxy(viewer.model, evt.fragIdsArray [0]) ;
        //a.geometry.computeBoundingBox () ;

        //evt.fragIdsArray.forEach (function (fragId) {
        //    console.log (fragId) ;
        //}) ;

        if ( evt.dbIdArray == undefined || evt.dbIdArray.length == 0 )
            return (this.activateRoomNavigation ()) ;
        var shutter =this.shutterLinkedObj [evt.dbIdArray [0]] ;
        if ( shutter === undefined )
            return (this.activateRoomNavigation ()) ;
        shutter [0] =shutter [0].replace (/\W/g, '') ;
        shutter [1] =shutter [1].replace (/\W/g, '') ;
        var def ={} ;
        def [shutter.join ('-') + '-open'] ='Open';
        def [shutter.join ('-') + '-half'] ='Half' ;
        def [shutter.join ('-') + '-close'] ='Close' ;
        def ['home'] ='Home' ;
        //def ['close'] ='Close Menu' ;
        def ['unselect'] ='Unselect' ;
        this.createShutterMenu (def) ;
        this.activateShutterNavigation (true) ;
    } ;

    this.createSensorMarkers =function () {
        var self =this ;
        for ( var key in sensors ) {
            var sensor =sensors [key] ;
			//var id =key.replace (/\W/g, '') ;
            var screenPoint =_self.worldToScreen (sensor.position, self.camera ()) ;
            //var offset =self.getClientOffset (self.container ()) ;
            $(document.createElement ('div'))
                //.attr ('class', '')
                .attr ('id', key)
                .css ('width', '32px').css ('height', '32px')
                .css ('position', 'absolute').css ('top', (screenPoint.y + 'px')).css ('left', (screenPoint.x + 'px'))
                .css ('background', 'transparent url(/images/sensortag.png) no-repeat')
                .css ('pointer-events', 'auto').css ('cursor', 'pointer')
                .css ('z-index', '6')
                .appendTo (this.houseNavigationMenu)
                .click (function (evt) {
                    evt.preventDefault () ;
                    var sensorid =$(evt.target).attr ('id') ;
                    self.navigate (sensors [sensorid] ['viewfrom'], sensors [sensorid] ['position']) ;
                    if ( _sensorPanels [sensorid] === undefined ) {
                        _sensorPanels [sensorid] =new Autodesk.Viewing.Extensions.IoTTool.SensorPanel (sensorid, _self) ;
                        _sensorPanels [sensorid].initializeFeeds () ;
                    }
                    self.activateSensorPanel (_sensorPanels [sensorid]) ;
                }) ;
        }
    } ;

    this.onCameraChanged =function (evt) {
        var self =this ;
        _navapi.toPerspective () ;
        _navapi.setVerticalFov (75, true) ;

        for ( var key in sensors ) {
            var sensor =sensors [key] ;
            var screenPoint =_self.worldToScreen (sensor.position, self.camera ()) ;
            //var offset =self.getClientOffset (self.container ()) ;
            $('#' + key)
                .css ('top', (screenPoint.y + 'px')).css ('left', (screenPoint.x + 'px')) ;
        }
    } ;

	this.onViewportSizeChanged =function () {
		if ( this.houseNavigationMenu !== undefined )
			this.houseNavigationMenu.css ('width', _container.outerWidth ()).css ('height', _container.outerHeight ()) ;
		if ( this.shutterMenu !== undefined )
			this.shutterMenu.css ('width', _container.outerWidth ()).css ('height', _container.outerHeight ()) ;
		this.onCameraChanged () ;
	} ;

    this.normalizeCoords =function (screenPoint) {
        var viewport =viewer.navigation.getScreenViewport () ;
        return ({
            x: (screenPoint.x - viewport.left) / viewport.width,
            y: (screenPoint.y - viewport.top) / viewport.height
        }) ;
    } ;

    this.worldToScreen =function (worldPoint, camera) {
        var p =new THREE.Vector4 (worldPoint.x, worldPoint.y, worldPoint.z, 1.0) ;
        p.applyMatrix4 (camera.matrixWorldInverse) ;
        p.applyMatrix4 (camera.projectionMatrix) ;
        // Don't want to mirror values with negative z (behind camera) if camera is inside the bounding box,
        // better to throw markers to the screen sides.
        if ( p.w > 0 ) {
            p.x /=p.w ;
            p.y /=p.w ;
            p.z /=p.w ;
        }
        // This one is multiplying by width/2 and Ã¢â‚¬â€œheight/2, and offsetting by canvas location
        var point =viewer.impl.viewportToClient (p.x, p.y) ;
        // snap to the center of the pixel
        point.x =Math.floor (point.x) + 0.5 ;
        point.y =Math.floor (point.y) + 0.5 ;
        return (point) ;
    } ;

    this.screenToWorld =function (event) {
        var screenPoint ={
            x: event.clientX,
            y: event.clientY
        } ;
        var viewport =viewer.navigation.getScreenViewport () ;
        var n ={
            x: (screenPoint.x - viewport.left) / viewport.width,
            y: (screenPoint.y - viewport.top) / viewport.height
        } ;
        return (viewer.navigation.getWorldPoint (n.x, n.y)) ;
    } ;

    this.getClientOffset =function (element) {
        var x = 0, y =0 ;
        while ( element ) {
            x +=element.offsetLeft - element.scrollLeft + element.clientLeft ;
            y +=element.offsetTop - element.scrollTop + element.clientTop ;
            element =element.offsetParent ;
        }
        return ({ 'x': x, 'y': y }) ;
    } ;

    this.activateRoomNavigation =function () {
        this.houseNavigationMenu.css ('display', 'block') ;
        if ( this.shutterMenu !== undefined ) {
            this.shutterMenu.remove () ;
            delete this.shutterMenu ;
        }
        $('div[id*=-panel]').css ('display', 'none') ;
    } ;

    this.activateShutterNavigation =function (bDisplay) {
		bDisplay =bDisplay || false ;
        this.houseNavigationMenu.css ('display', 'none') ;
        if ( this.shutterMenu !== undefined )
            this.shutterMenu.css ('display', 'block') ;
        $('div[id*=-panel]').css ('display', 'none') ;
		if ( bDisplay )
			setTimeout ($.proxy (function () { toggleOptions (this.shutterMenu.children ('.menu-selector')) ; }, this), 200) ;
    } ;

    this.activateSensorPanel =function (panel) {
        this.houseNavigationMenu.css ('display', 'none') ;
        if ( this.shutterMenu !== undefined ) {
            this.shutterMenu.remove () ;
            delete this.shutterMenu ;
        }
        panel.activate () ;
    } ;

} ;


// Sensor Panel
Autodesk.Viewing.Extensions.IoTTool.SensorPanel =function (sensorid, iotTool) {
    var _self =this ;
    var _tool =iotTool ; this.tool =function () { return (_tool) ; } ;
    var _sensorid =sensorid ; this.sensorid =function () { return (_sensorid) ; } ;

    var _scene =new THREE.Scene () ; this.scene =function () { return (_scene) ; } ;
    //var _panel =this.createSensorWall (sensors [sensorid] ['sensor'], sensorid) ; this.panel =function () { return (_panel) ; } ;
    var _charts =[] ; this.charts =function () { return (_charts) ; } ;

    this.createSensorWall =function (sensor, sensorid) {
        var self =this ;
        // HTML
        var element =$(document.createElement ('div'))
            .attr ('id', sensorid + '-panel')
            //.html ('Plain text inside a div')
            //.css ('z-index', 4)
            .attr ('class', 'three-div')
            .click (function (evt) {
                evt.preventDefault () ;
                var panel =$(evt.target).parents ('div[id*=-panel]') ;
                if ( panel.length == 0 )
                    panel =$(evt.target) ;
                panel.css ('display', 'none') ;
                panel.css ('pointer-events', 'none') ;
                $('#' + panel.attr ('id').split ('-') [0]).css ('display', 'block') ;
                _tool.activateRoomNavigation () ;
            }) ;
        // CSS Object
        var div =new THREE.CSS3DObject (element [0]) ;
        div.position.set (sensor.position.x, sensor.position.y, sensor.position.z) ;
        div.rotation.set (sensor.rotation.x, sensor.rotation.y, sensor.rotation.z) ; // Math.PI / 2 ;
        div.scale.set (sensor.scale, sensor.scale, sensor.scale) ;
        _scene.add (div) ;

        return (element) ;
    } ;

    var _panel =this.createSensorWall (sensors [sensorid] ['sensor'], sensorid) ; this.panel =function () { return (_panel) ; } ;

    this.initializeFeeds =function () {
        _panel.empty () ;

        var h3 =$(document.createElement ('h3'))
            .html ('Sensor: ' + _sensorid)
            .appendTo (_panel) ;

        var options ={
            width: 200, height: 200,
            redFrom: 30, redTo: 40,
            yellowFrom: -10, yellowTo: 0, yellowColor: '#0d0dd5',
            minorTicks: 5, min: -10, max: 40
        } ;
        _charts ['Temperature'] =this.createGaugeFeeds ('Temperature', options) ;

        options ={
            width: 200, height: 200,
            redFrom: 80, redTo: 100,
            yellowFrom: 0, yellowTo: 20,
            minorTicks: 5, min: 0, max: 100
        } ;
        _charts ['Humidity'] =this.createGaugeFeeds ('Humidity', options) ;

        options ={
            width: 200, height: 200,
            redFrom: 30, redTo: 40,
            yellowFrom: -10, yellowTo: 0, yellowColor: '#0d0dd5',
            minorTicks: 5, min: -10, max: 40
        } ;
        _charts ['Object Temp'] =this.createGaugeFeeds ('Object Temp', options) ;

        options ={
            width: 200, height: 200,
            greenFrom: 990, greenTo: 1100,
            minorTicks: 50, min: 800, max: 1200
        } ;
        _charts ['Pressure'] =this.createGaugeFeeds ('Pressure', options) ;

        _charts ['Object Temp2'] =this.createSmoothieFeeds ('Live') ;
    } ;

    this.updateFeeds =function (label, value) {
        if ( _charts [label] === undefined )
            return ;
        if ( _charts [label].hasOwnProperty ('gauge') ) {
            _charts [label].data.setValue (0, 1, value) ;
            _charts [label].gauge.draw (_charts [label].data, _charts [label].options) ;
        } else if (_charts [label].hasOwnProperty ('smoothie') ) {
            _charts [label].serie.append (new Date ().getTime (), value) ;
            console.log ('added') ;
        }
    } ;

    this.createGaugeFeeds =function (label, options) {
        var data =google.visualization.arrayToDataTable ([
            [ 'Label', 'Value' ],
            [ label, 20 ]
        ]) ;
        var tempOptions ={
            width: 200, height: 200,
            minorTicks: 5,
        } ;
        options =$.extend (tempOptions, options) ;

        var id =_sensorid + '-' + label.replace (/\W/g, '') ;
        var tempDiv =$(document.createElement ('div'))
            .attr ('class', 'panel-elt')
            .attr ('id', id)
            //.html (label)
            .appendTo (_panel) ;

        var chart =new google.visualization.Gauge (tempDiv [0]) ;
        chart.draw (data, tempOptions) ;
        return ({ 'gauge': chart, 'data': data, 'options': options }) ;
    } ;

    this.createSmoothieFeeds =function (label, options) { // canvas
        var id =_sensorid + '-' + label.replace (/\W/g, '') ;
        var tempDiv =$(document.createElement ('canvas'))
            .attr ('class', 'panel-elt-smoothie')
            .attr ('width', '400px')
            .attr ('height', '200px')
            .attr ('id', id)
            //.html (label)
            .appendTo (_panel) ;
            //.appendTo ($('#chart_div'))

        var chart =new SmoothieChart ({
            //grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
            //    lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
            //labels: { fillStyle:'rgb(60, 0, 0)' }

            grid: { fillStyle: 'rgba(0,0,0,0.52)', verticalSections: 4, millisPerLine: 1000 },
            millisPerPixel: 20,
            //timestampFormatter: SmoothieChart.timeFormatter,
            minValue: 0,
            maxValue: 50
        }) ;
        chart.streamTo (tempDiv [0]) ;

        // Data
        var data =new TimeSeries () ;

        // Add to SmoothieChart
        chart.addTimeSeries (data, { lineWidth: 2, strokeStyle: 'rgba(0,255,0,0.92)', fillStyle: 'rgba(58,133,70,0.83)' }) ;

        return ({ 'smoothie': chart, 'serie': data }) ;
    } ;

    this.activate =function () {
        _panel.css ('display', 'block') ;
        //_panel.css ('pointer-events', 'auto') ;
    } ;

} ;


// Utilities
function guid () {
    function s4 () {
        return (Math.floor ((1 + Math.random ()) * 0x10000)
            .toString (16)
            .substring (1)
        ) ;
    }
    return (s4 () + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + s4 () + s4 ()) ;
}

function shuttersDbIdsLinks (arr) {
    return (Object.keys (arr).reduce (
        function (previous, key) {
            if ( viewerCameras [key].hasOwnProperty ('shutters') )
            //previous [key] =arr [key] ['shutters'] ;
                previous =Object.keys (arr [key] ['shutters']).reduce (
                    function (prev, subkey) {
                        //prev [key + "\n" + subkey] =arr [key] ['shutters'] [subkey] ;
                        if ( typeof arr [key] ['shutters'] [subkey] !== "number" )
                            arr [key] ['shutters'] [subkey].map (function (id) { prev [id] =[ key, subkey ] ; })
                        else
                            prev [arr [key] ['shutters'] [subkey]] =[ key, subkey ] ;
                        return (prev) ;
                    },
                    previous
                ) ;
            return (previous) ;
        },
        {}
    )) ;
}

// Tests
var chart, line1, line2, ctx ;
/*
 // dynamic curves
 this.canvas =$(document.createElement ('canvas'))
 .attr ('class', 'graph-lines')
 .attr ('id', guid ())
 .css ('width', 300).css ('height', 100)
 .css ('position', 'absolute').css ('top', '0px').css ('left', '0px')
 .css ('overflow', 'hidden') ;
 $(viewer.container).append (this.canvas) ;
 this.canvasguid =this.canvas.attr ('id') ;
 test (this.canvas) ;
*/
function test (canvas) {
    //ctx =canvas [0].getContext ('2d') ;
    chart =new SmoothieChart ({
        grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(60, 0, 0)',
            lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
        labels: { fillStyle:'rgb(60, 0, 0)' }
    }) ;
    chart.streamTo (canvas [0]) ;

    // Data
    line1 =new TimeSeries () ;
    line2 =new TimeSeries () ;

    // Add a random value to each line every second
    setInterval (function () {
        line1.append (new Date ().getTime (), Math.random ()) ;
        line2.append (new Date ().getTime (), Math.random ()) ;
    }, 1000) ;

    // Add to SmoothieChart
    chart.addTimeSeries (line1, { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 }) ;
    chart.addTimeSeries (line2, { strokeStyle: 'rgb(255, 0, 255)', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 }) ;
}
