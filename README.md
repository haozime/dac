# Usage
## Install
```
npm install feloader
```

## Invoke
```
var Feloader = require("feloader");

var feloader = new Feloader([token="fe-move"], [head="head"], [tail="tail"]);
feloader.action(pageContent, [radical=false]);   // return the handled string.
```

# Features

## Situation 1: PUT Head

```
<script src="path/to.js" fe-move="head"></script>
<link type="text/css" href="path/to.css" fe-move="head" />
```

WHEN Open `radical` mode:

```
<script src="path/to.js"></script>
<link type="text/css" href="path/to.css" />
```
These assets will prepend before `</head>`.

## Situation 2: PUT Tail

```
<script src="path/to.js" fe-move="tail"></script>
<link type="text/css" href="path/to.css" fe-move="tail" />
```
These assets will prepend before `</body>`.

## Situation 3: KEEP Still

```
<script src="path/to.js" fe-move="any words except head & tail"></script>
<link type="text/css" href="path/to.css" fe-move="any words except head & tail" />
```

WHEN Close `radical` mode:

```
<script src="path/to.js"></script>
<link type="text/css" href="path/to.css" />
```
These assets won't change their own position!


## Besides
The Feloader Module also will complete the basic layout DOM, something like `DOCTYPE`, `<html>`, `<head>`, and `<body>`