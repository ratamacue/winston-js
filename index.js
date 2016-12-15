#!/usr/bin/env node

'use strict';
//const program = require('commander');

//console.log("Winston Says Hi!")


var rooms = [
  {
    "id": "room1",
    roomText: "There is a big door in front of us",
    "actions":[
      {"open door": (game)=>{game.switchRoom("room2")}}
    ]
  },
  {
    "id": "room2",
    roomText: "There is a giant pit in the middle of the room.",
    "actions":[
      {"left": function(state){}},
      {"right": function(state){}}
    ]
  }
]

var game = {
  room:getRoom("room1"),
  switchRoom:function(roomName){
    this.room=getRoom(roomName)
  }
}


/**
function(i){
  return i.id=="room1"
}
is the same as
(1)=>i.id=="room1"
*/

function getRoom(roomId){
  var results = rooms.filter((i)=>i.id==roomId)
  return results.length>0 ? results[0] : {}
}

console.log(game.room.roomText)

var stdin = process.openStdin();
stdin.addListener("data", function(input) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    //console.log("you entered: [" + d.toString().trim() + "]");
    var thingThePersonTyped = input.toString().trim()

    if(thingThePersonTyped === "?"){
      console.log("Here are some things you can do in this room right now...")
      var listOfThings = [].concat.apply([], game.room.actions.map(o=>Object.keys(o)))
      listOfThings.forEach(thing=>console.log("  * "+thing))
    }else{
      var action = game.room.actions.filter((action)=>action[thingThePersonTyped])
      if(action && action[0]){
        action[0][thingThePersonTyped](game)
      }else{
        console.log("That's not a thing you can do.")
      }
    }




    console.log(game.room.roomText)
    //console.log(game.room.roomText)
    //console.log(getRoom().roomText)
  });


//while(true){
//  console.log("This is a repl")
//  process.stdin.resume();
//  process.stdin.on('data', function (text) {
//    console.log("you typed "+ text);
//  })
//}

//console.log(getRoom("room2"))
