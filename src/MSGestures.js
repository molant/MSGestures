/*
 * MSGestures
 * https://github.com/molant/MSGestures
 *
 * Copyright (c) 2012 Anton Molleda
 * Licensed under the MIT, GPL licenses.
 */

(function () {
    "use strict";
    var eventsArray = [],
        supportedGestures = ["swipe", "pinch"],
        thresholds = {
            translation:15,
            velocity:10,
            scaleUp:1.2,
            scaleDown:0.8
        },
        MSGestures;

    //initialize the events array
    for (var i = 0; i < supportedGestures.length; i++) {
        eventsArray[supportedGestures[i]] = [];
    }

    function fireCallbacks(type, e) {
        var events = eventsArray[type];
        for (var i = 0; i < events.length; i++) {
            if (events[i].domElement === e.target) {
                events[i].callback(e);
            }
        }
    }

    function handleGesture(e) {
        //SWIPE detection
        if (Math.abs(e.translationX) >= thresholds.translation && e.velocityX > thresholds.velocity) {
            fireCallbacks("swipe", e);
        }

        //PINCH detection
        if (e.scale >= thresholds.scaleUp || e.scale <= thresholds.scaleDown) {
            fireCallbacks("pinch", e);
        }
    }


    function checkParameters(domElement, type, callback) {
        if (typeof domElement !== "undefined" && typeof domElement.nodeName !== "undefined") {
            throw {
                message:"domElement is not a valid DOM element"
            };
        }

        if (typeof eventsArray[type] === "undefined") {
            throw {
                message:"Gesture " + type + " is not currently supported"
            };
        }

        if (typeof callback !== "function") {
            throw {
                message:"callback parameter is not a function"
            };
        }
    }

    function addEventListener(domElement, type, callback) {
        var events, gesture;
        //parameter validation
        checkParameters(domElement, type, callback);

        events = eventsArray[type];

        for (var i = 0; i < events; i++) {
            if (events[i].domElement === domElement && events[i].callback === callback) {
                //handler already added. Should we added again?
                //If we are removing it should we throw an exception if it is not founded?
            }
        }

        gesture = new MSGesture();
        gesture.target = domElement;

        //we add the callback to our list
        events.push({
            gesture:gesture,
            domElement:domElement,
            callback:callback,
            addPointer: function(evt){
                this.gesture.addPointer(evt.pointerId)
            }
        });

        domElement.addEventListener("MSGestureChange", handleGesture);
        domElement.addEventListener("MSPointerDown", gesture.addPointer);
    }

    function removeEventListener(domElement, type, callback) {
        var gesture;
        checkParameters(domElement, type, callback);

        for(var i = 0; i < eventsArray[type].length;i++){
            gesture = eventsArray[type][i];
            if(gesture.domElement === domElement && gesture.callback === callback){
                //removing DOM events
                gesture.domElement.removeEventListener("MSGestureChange",handleGesture);
                gesture.domElement.removeEventListener("MSGestureChange",gesture.addPointer);
                //removing the reference to that element
                eventsArray[type].splice(i,1);
            }
        }
    }

    MSGestures = {
        addEventListener:addEventListener,
        removeEventListener:removeEventListener
    };

    window.MSGestures = MSGestures;
}());
