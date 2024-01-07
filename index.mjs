import fs from "fs";
import os from 'os';
import * as readline from 'node:readline/promises';  // This uses the promise-based APIs
// import { stdin as input, stdout as output } from 'node:process';
import inquirer from 'inquirer';
import select, { Separator } from '@inquirer/select';
import input from '@inquirer/input';


var initialPlayers = fs.readFileSync("./template_player.txt").toString().split("\n");
const yesAns = 'Y' || 'YES' || 'Yes'|| 'yes';
const noAns = 'N' || 'NO' || 'no' || 'No';
const choices = [
    {
        name: 'Start a new game',
        value: 'Start a new game',
        description: '',
      }
    ,
    {
        name: 'There is a new person get killed',
        value: 'There is a new person get killed',
        description: '',
      },
      {
        name: 'I am the first person get killed',
        value: 'I am the first person get killed',
        description: '',
      },
      {
        name: 'reassign assassinee',
        value: 'reassign assassinee',
        description: '',
      }
];

const removeKilled = (name) => {
    const remainPlayers = fs.readFileSync("./remain_players.txt", 'utf-8').split('\n');
    // find that person
    const thatPerson = remainPlayers.find(playerName => playerName.toLowerCase() === name.toLowerCase());
    if(thatPerson) {
        logInfoToFile('all_logs', name + '💀')
        const otherPerson = remainPlayers.filter(playerName => !(playerName.toLowerCase() === name.toLowerCase()));
        // re-write with the updated array 
        fs.writeFileSync("./remain_players.txt",otherPerson.join('\n'),{encoding:'utf8',flag:'w'})
    }else {
        console.log('That person is alreay 💀')
        openDashBoard()
    }
    
}

const reassign = (name) => {
    const remainPlayers = fs.readFileSync("./remain_players.txt", 'utf-8').split('\n');
    // find that person
    const otherPerson = remainPlayers.filter(playerName => !(playerName.toLowerCase() === name.toLowerCase()));
    var person = otherPerson[Math.floor(Math.random()*otherPerson.length)];
    console.log('reassign ' + person + ' to ' + name)

}

const logInfoToFile = (fileName, info) => {
    fs.appendFile(`${fileName}.txt`, info + os.EOL, (err) => { 
        if (err) { 
          console.log(err); 
        } 
        else { 
          // Get the file contents after the append operation 
          console.log("\nFile Contents of file after append:", 
            fs.readFileSync(`${fileName}.txt`, "utf8")); 
        } 
      });
    
}

const cleanupFile = (fileName) => {
    fs.writeFile(`${fileName}.txt`, '', function(){console.log('done')})
}


// const rl = readline.createInterface({ input, output });
const openDashBoard = async() =>{
    const answer = await
    select(
      {
        message: 'Please select an action',
        choices,
      },
  );
  if (answer === choices[0].name) {
      cleanupFile('remain_players');
      logInfoToFile('all_logs',os.EOL);
      fs.copyFile('template_player.txt', 'remain_players.txt', (err) => {
          if (err) throw err;
          console.log('source.txt was copied to destination.txt');
        });
  }else if (answer == choices[1].name) {
      const personName = await input({ message: "What is that person's name? " });
      removeKilled(personName)
  }else if(answer === choices[2].name) {
    const personName = await input({ message: "Hey moderator, what is your name" });
    removeKilled(personName)
    logInfoToFile('all_logs','moderator: ' + personName)
  }else if (answer === choices[3].name) {
    const personName = await input({ message: "what is the name of person needs reassignment" });
    // check remaining players
    reassign(personName)

  }
}

openDashBoard()

// const 

// log moderator name:
// const moderatorName = await rl.question('Hey moderator, What is your name? ');
// logInfoToFile('all_logs',moderatorName)


// rl.close();