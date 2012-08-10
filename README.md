# MSGestures

Small library concept to simplify how to handle the swipe and pinch gestures with MSGestures in IE10+

## Getting Started
In your web page:

```html
<script src="MSGestures.js"></script>
<script>
var gestures = new MSGestures();
var domEle = document.getElementById('someId');
gestures.addEventListener(domEle, 'swipe', function(e){
    console.log('swipe!');
}
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Anton Molleda  
Licensed under the MIT, GPL licenses.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).
