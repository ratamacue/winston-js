#!/usr/bin/env node

'use strict';

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

var rooms = [
  {
    "id": "room1",
    roomText: "There is a big door in front of you",
    "actions":[
      {"look": (game)=>{game.message("The walls around you are made of bricks.  Low lighting is coming from a faint ceiling light.")}},
      {"open door": (game)=>{game.switchRoom("room2")}}
    ]
  },{
    "id": "room2",
    roomText: "There is a giant pit in the middle of the room.",
    "actions":[
      {"look": (game)=>{game.message("In this room the light is darker than where you started,  causing your eyes to maybe make a MISCONCEPTION,   the walls have an odd pattern scribbled all over.")}},
      {"left": (game)=>{game.message("You can't go that way!  The pit is blocking it.")}},
      {"right": (game)=>{game.message("You can't go that way!  The pit is blocking it.")}},
      {"forward": (game)=>{game.switchRoom("room3")}}
    ]
  }, {
    "id":  "room3",
    roomText: "Turns out the floor just had black paint on it, there is no hole",
    "actions":[
      {"look": (game)=>{game.message("In front of you,  all you can see is a dark straight hallway,  it's going on for what seems like miles.  Glancing to your right,  you see a short hallway with a door at the end.  Glancing to you left,  you see the same.  There's something off about the door to your right,  something on it is shiny and dangling off of it.")}},
      {"forward": (game)=>{game.switchRoom("darkroom")}},
      {"left": (game)=>{game.switchRoom("chestroom")}},
      {"right": (game)=>{game.switchRoom("lockeddoor")}},
    ]
  }
  , {
    "id":  "lockeddoor",
    roomText: "You are in front of the door",
    "actions":[
      {"look": (game)=>{game.message("In front of you is the door,  what turned out to be shining was a padlock")}},
      {"inspect": (game)=>{game.switchRoom("lockeddoorsub")}},
      {"enter code": (game)=>{
        if(game.argument() == "123"){
          //They got the message correct.
        }else{
          game.message("Nope, that's not it.")
        }
      }}
    ]
  }
]

var game = {
  room:getRoom("room1"),
  switchRoom:function(roomName){
    this.room=getRoom(roomName)
  },
  message:function(message){
    var lotsOfEquals = Array(process.stdout.columns).join("=");
    console.log(`\n${lotsOfEquals}\n${message}\n${lotsOfEquals}`);
  }
}


function getRoom(roomId){
  var results = rooms.filter((i)=>i.id==roomId)
  return results.length>0 ? results[0] : {}
}

function processInput(input) {
  var thingThePersonTyped = input.toString().trim()

  if(thingThePersonTyped === "?"){
    console.log("Here are some things you can do in this room right now...")
    var listOfThings = [].concat.apply([], game.room.actions.map(o=>Object.keys(o)))
    listOfThings.forEach(thing=>console.log("  * "+thing))
  }else if(thingThePersonTyped.startsWith("teleport")){
    var destination = thingThePersonTyped.split("teleport ")[1];
    console.log("Teleporting to "+destination);
    game.switchRoom(destination);
  }else{
    var actionString = game.room.actions.flatMap(Object.keys).find(k=>thingThePersonTyped.startsWith(k));
    try{
      game.args = thingThePersonTyped.split(actionString)[1].trim();
    }catch(exception){
      game.args="";
    }
    var action = game.room.actions.filter((a)=>a[actionString]);
    if(action && action[0]){
      action[0][actionString](game)
    }else if (action != ""){
      console.log("That's not a thing you can do.")
    }
  }
  console.log(game.room.roomText)
  process.stdout.write("> ")
};

var stdin = process.openStdin();
stdin.addListener("data", processInput);
processInput("");
