#!/usr/bin/env node

var ProgressBar = require('node-progress').get();

'use strict';

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};



var rooms = [
  {
    "id": "room1",
    roomText: "There is a big door in front of you.",
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
      {"left": (game)=>{game.switchRoom("leftturnbeginning")}},
      {"right": (game)=>{game.switchRoom("lockeddoor")}},
    ]
  }
  , {
    "id":  "lockeddoor",
    roomText: "You are in front of a door.",
    "actions":[
      {"look": (game)=>{game.message("In front of you is a door,  what turned out to be shining, was a padlock.")}},
      {"inspect": (game)=>{game.switchRoom("lockeddoorsub")}},
      {"enter code": (game)=>{
        if(game.argument() == "767784FGH56WHELA???#"){
          game.message("You got the secret code!")
        }else{
          game.message("Nope, that's not it.")
        }
      }}
    ]
  }
  , {
    "id":  "leftturnbeginning",
    roomText: "You are in front of a door.",
    "actions":[
      {"look": (game)=>{game.message("The door is very beat up,  chipped pieces of wood,  scratched door knob,  this door has seen better days.  You can hear an ominous scratching on the outside of the door.")}},
      {"open door": (game)=>{game.switchRoom("leftsubroom")}},

    ]
  }
  , {
    "id":  "leftsubroom",
    roomText: `Woah woah woah,  are you sure?  Did you even "look" at the door?  If so you understand the danger that could be behind this door...  So this is a chance to turn back,  open the door? `,
    "actions":[
      {"yes": (game)=>{
        game.message("The door opened...  Out jumped a large creature,  before you can identify or even know what the thing was,  you were on the ground.  Your hand is soaked in blood,  it cut you.  There are claw marks,  meaning this could be pretty much every single animal that has paws.  This is not a very finite amount of animals,  this didn't even help ruling out the animal that just cut you.  But I just decided to write this anyway.");
        game.switchRoom("anotherroom")
      }},
      {"no": (game)=>{game.switchRoom("leftturnbeginning")}},
      //{`Isn't this illogical to quote "look" if that's a normal word?  Or are you hinting towards some sort of higher power deciding if I "look" at the door?  Are you crazy?  Well it's not my business`: (game)=>{game.message("Indeed this isn't your business.")}},

    ]
  }
  ,
  {
    "id": "anotherroom",
    roomText: "You need some banages...  You need to get back home.",
    "actions":[
      {"home?": (game)=>{game.message("You're right.  We're far from home now.  In fact did you really ever wonder where we are anymore?  It's the last you remember,  after all I'm the narrator and I intentionally left shallow background to this story.")}},
      {"look": (game)=>{game.message("What was behind the door turned out to be a room with metal a metal gate in front of you.  This gate isn't made from bars,  it's fully reinforced iron with no bars.  You cannot see anything going on.  The only lighting is from two torches to your left and right.  Looking up you see a trap door.")}},
      {"open door": (game)=>{
        game.message("It won't budge...  Suddenly behind you the door you opened seems to have slammed shut.  Not only this,  but quickly another iron door comes right up from under the door frame crushing it from bottom to top leaving no exit.")
        game.switchRoom("anooooooootherroom");
      }}
    ]},
    {
      "id": "anooooooootherroom",
      roomText: "You're trapped.",
      "actions":[
        {"wait": (game)=>{
          game.message("You waited.  5 minutes passed,  it seemed like hours.  Your hand is still in so much pain.  Out the top of your room,  the trap door opens.  Falling on top of you is a pair of leather gloves and a yellow bandanna.")
          game.switchRoom("battle");

      }},
        {"scream": (game)=>{game.message("You yelled at the top of your lungs,  all this did was hurt your ears from the echo that had nowhere to escape.")}}
      ]
    },
    {
      "id": "battle",
      roomText: "You can hear beeps.  Seems to be getting louder every second.  It might be counting down from 10...  Right,  the clothing.  You put on the gloves.  Where will you put the bandanna?  You couldn't decide so I decided for you,  you put it on your neck.",
      "actions":[
        {"wait": (game)=>{game.message("You waited.  And the metal gate opened.")
        game.switchRoom("almostthere")
      }}
      ]
    },
    {
      "id": "almostthere",
      roomText: "Now the the gates have opened,  you can hear a crowd cheering.  They're shouting a name, Do you hide in the tiny room?  Or run out?",
      "actions":[
        {"look": (game)=>{game.message("You look out into a big arena.  Out there stands a man,  he raises his sword.  And the crowds get louder,  the cheering is understandable.  They're yelling 'Carnifex'")}},
        {"run out": (game)=>{game.switchRoom("battle1")}},
        {"hide": (game)=>{
          game.message("You hid,  that got you nowhere.  You got pulled out by the hand, ouch!  And dragged into this large dusty arena.");
          //game.battle(game, firstBattle)
          game.switchRoom("battle1")
      }}
      ]
    },
    {
      "id": "battle1",
      roomText: (game) => {
        if(game.battle.timeUp(game)){
          game.battle.enemyAttack();
        }else if(game.battle.isBattleOver(game)){
          console.log("The Game Is Over!")
        }


        if(game.battle.battleMessage){
          return game.battle.battleMessage;
        }else{
          return "You Have "+ (game.battle.battleTime - ((new Date()).getTime() - game.battle.timeStart.getTime())/1000).toFixed(0) + " seconds."
        }
      },
      battleMessage: null,
      initialize: (game)=>{
        game.battle = {
          damage:0,
          enemyHealth:10000,
          accuracy: 0.8,
          timeStart : new Date(),
          userhealth : 10000,
          battleTime: 10,
          playerTimeRestart : () => {
            game.battle.battleMessage=null;
            game.battle.timeStart = new Date() ;
          },
          timeUp : ()=>{
            return secondsSince(game.battle.timeStart) > game.battle.battleTime;
          },
          enemyAttack: ()=>{
            let enemyMiss = ()=>{
              game.message( "Enemy has missed!" );
              game.battle.playerTimeRestart();
            }
            let enemyHit = ()=>{
              game.message("Look Out!");
              game.battle.playerTimeRestart();
              game.switchRoom("dodge");
            }

            //There are two options
            let options = [enemyMiss, enemyHit];

            //Randomly choose between the two
            let decision = options[Math.floor(Math.random()*options.length)];

            //Call the one we chose
            decision();

          },
          continue: ()=>{
            game.battle.playerTimeRestart();
            game.switchRoom("battle1", {skipinit:true});
          },
          isBattleOver: ()=>{
            //console.log("end game check");
            if (game.battle.enemyHealth < 1) {
              return true;
            }else if(game.battle.userhealth)
            return false; //True if the game is over.
          }
        }

      },
      "actions":[
        {"punch": (game)=>{
          if(Math.random() > game.battle.accuracy){
            game.message(`PUNCH!!!.  You Missed.`);
          }else{
            game.battle.damage=50 + game.battle.damage
            game.message(`PUNCH!!!.  You landed a hit, and it did 50 damage!  Total damge dealt is ${game.battle.damage} out of ${game.battle.enemyHealth}`);
          }
        }},
        {"kick": (game)=>{
          if(Math.random() > game.battle.accuracy){
            game.message(`KICK!!!.  You Missed.`);
          }else{
            game.battle.damage=100 + game.battle.damage;
            game.message(`KICK!!!.  You landed a hit, and it did 100 damage!  Total damge dealt is ${game.battle.damage} out of ${game.battle.enemyHealth}`);
          }
        }}

      ]
    },{
      "id": "dead",
      roomText: "You Are Dead",
      "actions":[]
    },
    {
      "id": "dodge",
      roomText: (game)=>{
        if(game.battle.timeUp()){
            game.battle.continue();
            game.battle.userhealth = game.battle.userhealth - 1000;
            return "You ran out of time!";
        }else if(  game.battle.dodge == true){
            game.battle.dodge=false;
            game.battle.continue();
            return "You dodged the attack!";
        }else{
          return "Watch out! Dodge!";
        }

      },
      "actions":[
        {"dodge": (game)=>{
            game.battle.dodge = true;
        }}
      ]
    }

]

function secondsSince(then){
  var now = new Date();
  return (now.getTime() - then.getTime() ) / 1000
}


var firstBattle = {
  timeRemaining:0,
  battleEvents : [
    {
      message:"First",
      timeAllowed:100,
      actions:[
        (response)=>{

        }
      ],
      handleResponse(player, response){}
    },
    {
      message:"second",
      timeAllowed:200,
      actions:[
        (response)=>{

        }
      ]
    },

  ]
}

var game = {
  room:getRoom("room1"),
  switchRoom:function(roomName, opts){
    opts = opts || {};
    if(getRoom(roomName)){
      this.room=getRoom(roomName);
      if(this.room.initialize && !opts.skipinit) this.room.initialize(game);
    }
    else console.log(`There is no such room, "${roomName}"`)
  },
  battle:function(game, battleDescription){
    battleDescription.battleEvents.forEach(battleEvent=>{
      console.log(battleEvent.message);

      var bar = new ProgressBar(':bar', { total: 100 });
      var timer = setInterval(function () {
        bar.tick();
        if (bar.complete) {
          console.log('You Have Died');
          clearInterval(timer);
        }
      }, 100);

      process.stdout.write("BATTLE > ")
      var stdin = process.openStdin();
      stdin.addListener("data", bar.interrupt);
    });

  },
  message:function(message){
    var lotsOfEquals = Array(process.stdout.columns).join("=");
    console.log(`\n${lotsOfEquals}\n${message}\n${lotsOfEquals}`);
  },
  argument:function(){
    return this.args || ""
  }
}


function getRoom(roomId){
  var results = rooms.filter((i)=>i.id==roomId)
  return results[0]
}

function processInput(input) {
  var thingThePersonTyped = input.toString().trim()

  if(thingThePersonTyped === "?"){
    console.log("Here are some things you can do right now...")
    var listOfThings = [].concat.apply([], game.room.actions.map(o=>Object.keys(o)))
    listOfThings.forEach(thing=>console.log("  * "+thing))
  }else if(thingThePersonTyped.startsWith("teleport")){
    var destination = thingThePersonTyped.split("teleport ")[1];
    console.log("Teleporting to "+destination);
    game.switchRoom(destination);
  }else{
    if(!game.room.actions.flatMap) console.log("Ruh Roh.  No Actions in this room.")
    var actionString = game.room.actions.flatMap(Object.keys).find(k=>thingThePersonTyped.startsWith(k));
    try{
      var typedArguments = thingThePersonTyped.split(actionString)[1]
      if(typedArguments) game.args = typedArguments.trim();
    }catch(exception){
      console.log(exception)
      game.args="";
    }
    var action = game.room.actions.filter((a)=>a[actionString]);
    if(action && action[0]){
      action[0][actionString](game)
    }else {
      console.log("That's not a thing you can do.")
    }
  }
  var roomText = isFunction(game.room.roomText) ? game.room.roomText(game) : game.room.roomText
  console.log(roomText)
  process.stdout.write("> ")
};

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}



var stdin = process.openStdin();
stdin.addListener("data", processInput);
processInput("");
