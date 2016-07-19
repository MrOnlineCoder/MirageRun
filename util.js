function randomString(len)
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getMaxKeys(hashmap) {
	var max = Object.keys(hashmap).reduce(function(max,key){
	  return (max === undefined || hashmap[key] > hashmap[max]) ? +key : max;
	});

	return max;
}


function randomArrayToFind(length) {
	var arr = [];
	for (var i=0;i<length;i++) {
		arr[i] = Math.floor(Math.random() * 9) + 1;
	}

	var rndLength = Math.floor(Math.random() * length-1);

	arr[rndLength] = 0;

	return arr;
}

function randomInt(min,max) {
	return Math.floor(Math.random() * max) + min;
}

function sortHashmap(obj) {
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}
function getWordFromList() {
	var words = ["computer","fastfood","break","javascript","football","banana","english","amazing","awesome","dangerous","funny","expression","builder","gamer","policeman","template"]
	return words[randomInt(0,words.length-1)];
}
function reverseString(s) {
  var o = '';
  for (var i = s.length - 1; i >= 0; i--)
    o += s[i];
  return o;
}

module.exports.randomString = randomString;
module.exports.getMaxKeys = getMaxKeys;
module.exports.randomArrayToFind = randomArrayToFind;
module.exports.sortHashmap = sortHashmap;
module.exports.randomInt = randomInt;
module.exports.getWordFromList = getWordFromList;
module.exports.reverseString = reverseString;