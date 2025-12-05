// https://github.com/kripken/speak.js/blob/master/speakWorker.js
importScripts('speakGenerator.js');

onmessage = function(event) {
  postMessage(generateSpeech(event.data.text, event.data.args));
};

