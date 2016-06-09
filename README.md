# Public Heroku WEB site for private access to my House IoT Project

[![Node.js](https://img.shields.io/badge/Node.js-5.11.1-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-3.9.3-blue.svg)](https://www.npmjs.com/)
[![Viewer](https://img.shields.io/badge/Forge%20Viewer-v2.8-green.svg)](http://developer-autodesk.github.io/)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://opensource.org/licenses/MIT)


<b>Note:</b> For using this sample, you need a valid oAuth credential for the translation / extraction portion.
Visit this [page](https://developer.autodesk.com) for instructions to get on-board.

<b>Note:</b> It also relies on the https://github.com/cyrillef/PlougonvelinNode Project which is the real brain 
running on a BeagleBone Black device which controls the shutters, lights, and sensors.


## Live demo at
http://plougonvelin.herokuapp.com/


## Description

This sample uses the Autodesk Forge Viewer to display my house, and has a Forge Viewer IoT Extension to
connect to my house BeagleBone Black IoT implementation via a secured socket.io connection.
However, the security layers is not demonstrated in this repo.

## Dependencies

This sample is dependent of Node.js and few Node.js extensions which would update/install automatically via 'npm':

1. Node.js

    Node.js - built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
	You can get Node.js from [here](http://nodejs.org/)<br /><br />
	Node.js modules:
	```
    "async": ">= 1.2.0",
    "body-parser": ">= 1.11.0",
    "connect-multiparty": ">= 1.2.5",
    "cron": ">= 1.0.6",
    "ejs": ">= 2.2.4",
    "express": ">= 4.12.3",
    "fs": ">= 0.0.2",
    "mailjet-sendemail": "^1.1.4",
    "mkdirp": ">= 0.5.0",
    "moment": ">= 2.10.3",
    "mongoose": "^4.1.6",
    "node-rtsp-stream": "0.0.3",
    "node-schedule": ">= 0.2.9",
    "nodemailer": "^1.4.0",
    "nodemailer-direct-transport": "^1.0.2",
    "nodemailer-smtp-transport": "^1.0.3",
    "path": ">= 0.11.14",
    "request": ">= 2.55.0",
    "serve-favicon": "^2.3.0",
    "socket.io": "^1.3.7",
    "socket.io-stream": "^0.9.0",
    "stream": ">= 0.0.2",
    "unirest": "^0.4.2",
    "url": ">= 0.10.2",
    "util": ">= 0.10.3",
	"bower": "^1.6.5",
    "ws": "^0.8.0"
	```

2. Angular.js - AngularJS is what HTML would have been, had it been designed for building web-apps.
    Declarative templates with data-binding, MVW, MVVM, MVC, dependency injection and great
    testability story all implemented with pure client-side JavaScript!, available [here](https://angularjs.org/).

3. jquery.js - jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document
    traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API
    that works across a multitude of browsers. With a combination of versatility and extensibility, jQuery
    has changed the way that millions of people write JavaScript., available [here](https://jquery.com/).

4. socket.io

All these libraries can be install via bower
    ```
    "async":                  "1.4.2",
    "jquery":                 "2.1.4",
    "angular":                "1.3.15",
    "angular-resource":       "1.3.15",
    "angular-route":          "1.3.15",
    "angular-bootstrap":      "0.12.0",
    "angular-material-icons": "0.4.0",
    "angular-sanitize":       "1.3.15",
    "angular-strap":          "2.1.6",
    "angular-tree-control":   "0.2.8",
    "angular-ui":             "0.4.0",
    "angular-ui-grid":        "3.0.0-rc.20",
    "angular-ui-layout":      "1.0.5",
    "bootstrap":              "3.3.2",
    "bootstrap-select":       "1.6.4",
    "bootstrap-social":       "4.9.0",
    "dragula.js":             "1.5.1",
    "angular-motion":         "0.3.4",
    "flow.js":                "2.9.0",
    "font-awesome":           "4.3.0",
    "js-data":                "1.5.10",
    "js-data-angular":        "2.2.3",
    "js-data-localstorage":   "1.0.1",
    "lodash":                 "3.8.0",
    "lockr":                  "0.8.2",
    "svg-morpheus":           "0.1.8",
    "requirejs":              "2.1.17",
    "socket.io-client":       "1.3.7",
    "raf.js":                 "0.0.4",
    "view-and-data-toolkit":  "*"
    ```

	
## Setup/Usage Instructions

The sample was created using Node.js and javascript.

### Deploy on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Once the Heroku server is setup, go on your Heroku Dashboard, select this new server, next Settings, and
press the 'Reveal Config Vars.' button.

Create 3 variables like this:

a. PORT = 80

b. CONSUMERKEY = &lt;your consumer key&gt;

c. CONSUMERSECRET = &lt;your consumer secret&gt;

Next restart the server.


--------

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by

Cyrille Fauvel (Autodesk Developer Network)<br />
http://www.autodesk.com/adn<br />
http://around-the-corner.typepad.com/<br />
