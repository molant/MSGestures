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
        domElements = [],
        supportedGestures = ["swipe", "pinch"],
        thresholds = {
            translation:10,
            velocity:0.5,
            scaleUp:1.3,
            scaleDown:0.7
        },
        MSGestures;

    //initialize the events array
    for (var i = 0; i < supportedGestures.length; i++) {
        eventsArray[supportedGestures[i]] = [];
    }

    function fireCallbacks(type, e) {
        var callbackName = type + 'Callback',
            container;
        for (var i = 0; i < eventsArray.length; i++) {
            container = eventsArray[i];
            if (container.domElement === e.target) {
                if (Array.isArray(container[callbackName])) {
                    for (var j = 0; j < container[callbackName].length; j++) {
                        container[callbackName][j](e);
                    }
                }
            }
        }
    }

    function handleGesture(e) {
        //console.log('scale: ' + e.scale + ' translation: ' + e.translationX + ' velocity: ' + e.velocityX);
        this.velocity += e.velocityX;
        this.translation += e.translationX;
        this.scale *= e.scale;

        //console.log(e.scale + ' ' + this.scale + ' ' + thresholds.scaleDown);
        //PINCH detection
        if (this.capturing && (this.scale >= thresholds.scaleUp || this.scale <= thresholds.scaleDown)) {
            fireCallbacks("pinch", e);
            this.capturing = false;
            return;
        }

        //SWIPE detection
        if (this.capturing && this.scale === 1 && (Math.abs(this.translation) >= thresholds.translation)) {
            this.capturing = false;
            fireCallbacks("swipe", e);
        }
    }

    function gestureStop(e) {
        this.translation = 0;
        this.velocity = 0;
        this.scale = 1;
        this.capturing = true;
    }


    function checkParameters(domElement, type, callback) {
        if (typeof domElement === "undefined" || typeof domElement.nodeName === "undefined") {
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
        var events, gesture, gestureContainer, callbackName = type + 'Callback', existing = false;
        //parameter validation
        checkParameters(domElement, type, callback);

        for (var i = 0; i < eventsArray.length; i++) {
            if (eventsArray[i].domElement === domElement) {
                if (!Array.isArray(eventsArray[i][callbackName])) {
                    eventsArray[i][callbackName] = [];
                }
                eventsArray[i][callbackName].push(callback);
                //we add the new gesture callback and we quit. The general gesture handler will take care of the rest
                return;
            }
        }

        gesture = new MSGesture();
        gesture.target = domElement;

        gestureContainer = {
            gesture:gesture,
            domElement:domElement,
            translation:0,
            velocity:0,
            scale:1,
            capturing:true,
            addPointer:function (evt) {
                gesture.addPointer(evt.pointerId)
            }
        };
        gestureContainer[type + 'Callback'] = [];
        gestureContainer[type + 'Callback'].push(callback);

        //we add the callback to our list
        eventsArray.push(gestureContainer);

        domElement.addEventListener("MSGestureChange", handleGesture.bind(gestureContainer));
        domElement.addEventListener("MSGestureEnd", gestureStop.bind(gestureContainer));
        domElement.addEventListener("MSPointerDown", gestureContainer.addPointer);

        //adding CSS class to prevent default touch actions
        domElement.style.msTouchAction = "none";
    }

    function removeEventListener(domElement, type, callback) {
        var gesture;
        checkParameters(domElement, type, callback);

        for (var i = 0; i < eventsArray[type].length; i++) {
            gesture = eventsArray[type][i];
            if (gesture.domElement === domElement && gesture.callback === callback) {
                //removing DOM events
                gesture.domElement.removeEventListener("MSGestureChange", handleGesture);
                gesture.domElement.removeEventListener("MSGestureChange", gesture.addPointer);
                //adding CSS class to prevent default touch actions
                gesture.domElement.style.msTouchAction = "";
                //removing the reference to that element
                eventsArray[type].splice(i, 1);
            }
        }
    }

    MSGestures = {
        addEventListener:addEventListener,
        removeEventListener:removeEventListener
    };

    window.MSGestures = MSGestures;
}());
