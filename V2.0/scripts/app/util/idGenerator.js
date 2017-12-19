/**
 * Created by JacobJaffe on 11/10/17.
 */

//https://codepen.io/gabrieleromanato/pen/Jgoab

generateRandomId = function (length) {
    var timestamp = +new Date;

    var ts = timestamp.toString();
    var parts = ts.split("").reverse();
    var id = "";

    for (var i = 0; i < length; ++i) {
        var index = getRandomInt(0, parts.length - 1);
        id += parts[index];
    }

    return id;
};

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * ( max - min + 1 )) + min;
};
