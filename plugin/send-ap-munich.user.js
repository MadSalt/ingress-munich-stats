// ==UserScript==
// @id             iitc-plugin-send-ap-munich@macrojames
// @name           IITC plugin: send-ap-munich
// @version        0.8-20130905.113050
// @namespace      https://github.com/breunigs/ingress-intel-total-conversion
// @description    [release-2013-09-05-113050] Send AP, Faction, Username, Userguid to ingress-munich.de
// @updateURL      http://ingress-munich.de/stats/plugin/send-ap-munich.user.js
// @downloadURL    http://ingress-munich.de/stats/plugin/send-ap-munich.user.js
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

/**
 * Introduction, starting with 0.8
 * 
**/

function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};



// PLUGIN START ////////////////////////////////////////////////////////
   
// use own namespace for plugin
window.plugin.sendApMunich= function() {};
window.plugin.sendApMunich.api_version = 1;

window.plugin.sendApMunich.sendToServer = function(requestData){ 
    $.ajax({
        type: "POST",
        url: "http://ingress-munich.de/stats/setStats.php",
        data: requestData,
        settings: {crossDomain: true},
        success: window.plugin.sendApMunich.responseRecieved
    });
};

window.plugin.sendApMunich.iitcLoaded = function(){
    window.plugin.sendApMunich.sendStats();
};

window.plugin.sendApMunich.responseRecieved = function (data){
    if (data.code == 200){
        console.log("Successfully transmitted AP");
    }
    else if(data.code == 403){
        console.log("Password error for transmission of AP");
        window.plugin.sendApMunich.requestPW();
        window.plugin.sendApMunich.sendStats();
    } else {
        console.log("Other");
        console.log(data);
    }
}
      
window.plugin.sendApMunich.sendStats = function(){
    stats = {};
    if ('ap' in window.PLAYER) {
        stats.ap = window.PLAYER.ap;
       
    } else return false
    if ('nickname' in window.PLAYER) {
        stats.player = window.PLAYER.nickname;
    } else return false
    if ('team' in window.PLAYER) {
        stats.team = window.PLAYER.team;
    } else return false
    if ('sendApMunich.'+window.PLAYER.nickname+'.pw' in localStorage &&
        localStorage['sendApMunich.'+window.PLAYER.nickname+'.pw'] != "" &&
        localStorage['sendApMunich.'+window.PLAYER.nickname+'.pw'] != null) {
        stats.pw = localStorage['sendApMunich.'+window.PLAYER.nickname+'.pw'];
    } else {
        window.plugin.sendApMunich.requestPW(true);
        stats.pw = localStorage['sendApMunich.'+window.PLAYER.nickname+'.pw'];
    }
    window.plugin.sendApMunich.sendToServer(stats);
    return true
};

window.plugin.sendApMunich.requestPW = function(firstTime){
    newPW = "";
    while(newPW == "" || newPW == null || newPW == undefined){
        if (firstTime) {
            newPW = prompt("Um deine AP an ingress-munich.de zu senden, muss ein Passwort festgelegt werden! Bitte nicht das Login-Passwort verwenden!");
        } else {
            newPW = prompt("Authorisierung bei ingress-munich.de fehlgeschlagen, bitte das korrekte Passwort eingeben!"); 
        }
    }
    localStorage['sendApMunich.'+window.PLAYER.nickname+'.pw'] = newPW;
};

window.plugin.sendApMunich.setup = function() {
    window.addHook('iitcLoaded', window.plugin.sendApMunich.iitcLoaded);
    console.log("PLUGIN: iitc-plugin-send-ap-munich");
    
};

var setup =  window.plugin.sendApMunich.setup;
// PLUGIN END //////////////////////////////////////////////////////////


if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);


