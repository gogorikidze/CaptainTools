const serversideApiKey = "71f1b01d-3170-4613-ab20-b6d72ca7dc2b"
const mapPool = ["de_vertigo", "de_overpass", "de_inferno", "de_mirage", "de_dust2", "de_cache", "de_train", "de_nuke"];

let players = {};
let team1, team2;
let team1stats = {};
let team2stats = {};

getMatchData("1-26c03ecf-9317-4ef6-ae51-37c70340c67f");



//gets a winrate for a sigle map
function getMapWinrate(segments, mapName){
  if(segments != undefined){ // if map data exists
    for(b = 0; b < segments.length; b++){
      if(segments[b].label == mapName){
        return segments[b].stats.Wins / segments[b].stats.Matches * 100;
      }
    }
    return 50;
  }
  return 50;
}
//gets winrate for all maps in a map pool
function getMapStats(playerID, pos){
  getFaceitData("https://open.faceit.com/data/v4/players/"+playerID+"/stats/csgo", function(response){
    if(response != false){ // if player has csgo stats
      var winrates = {};
      for(a = 0; a < mapPool.length; a++){
        winrates[mapPool[a]] = getMapWinrate(response.segments, mapPool[a]).toFixed(2);
      }
      players[pos].winrate = winrates;
    }
  });
}
//gets player stats
function getPlayerStats(playerID){
  getFaceitData("https://open.faceit.com/data/v4/players/"+playerID+"/stats/csgo", function(response){
    console.log(response);
  });
}
//gets profile data
function getProfileData(nickname){
  getFaceitData("https://open.faceit.com/data/v4/players?nickname="+nickname, function(response){
    console.log(response);
  });
}
//general function for getting data using faceit API [returns Json as first parameter of fed function]
function getFaceitData(url, onload){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         onload(JSON.parse(request.responseText));
      }
  };
  request.open("GET", url, true);
  request.setRequestHeader("Authorization", "Bearer "+serversideApiKey);
  request.send();

  //checks if csgo hasnt been played yet on the account
  request.onloadend = function() {
    if(request.status == 404){
      onload(false);
    }
  }

}
//gets all the players from both teams and put them in "players" obj
function getMatchData(matchID){
  getFaceitData("https://open.faceit.com/data/v4/matches/"+matchID, function(response){
    //set team names
    team1 = response.teams.faction1.name;
    team2 = response.teams.faction2.name;
    document.getElementById("team1").innerText = team1;
    document.getElementById("team2").innerText = team2;

    //adds faction1 ids to team1 array;
    for(i = 0; i <= 4; i++){
      players[i] = {id: response.teams.faction1.roster[i].player_id, team:response.teams.faction1.name, winrate:0};
    }
    //adds faction2 ids to team2 array;
    for(i = 0; i <= 4; i++){
      players[i + 5] = {id: response.teams.faction2.roster[i].player_id, team:response.teams.faction2.name, winrate:0};
    }

    for(i = 0; i <= 9; i++){
      getMapStats(players[i].id, i);
    }

    getTeamAvg();
  });
}
function getTeamAvg(){
  if(Object.keys(players[9].winrate).length === 8){
    //creates pool of maps for global winrates
    for(a = 0; a < mapPool.length; a++){
      team1stats[mapPool[a]] = 0;
      team2stats[mapPool[a]] = 0;
    }
    //add all the individual winrates to global
    for(i = 0; i <= 4; i++){
      for(a = 0; a < mapPool.length; a++){
        team1stats[mapPool[a]] = parseInt(team1stats[mapPool[a]]) + parseInt(players[i].winrate[mapPool[a]]);
      }
    }
    //divide it by 5 to get average
    for(a = 0; a < mapPool.length; a++){
      team1stats[mapPool[a]] = team1stats[mapPool[a]]/5;
    }


    //add all the individual winrates to global
    for(i = 5; i <= 9; i++){
      for(a = 0; a < mapPool.length; a++){
        team2stats[mapPool[a]] = parseInt(team2stats[mapPool[a]]) + parseInt(players[i].winrate[mapPool[a]]);
      }
    }
    //divide it by 5 to get average
    for(a = 0; a < mapPool.length; a++){
      team2stats[mapPool[a]] = team2stats[mapPool[a]]/5;
    }
    console.log(team2stats);
    displayRawWinrates();
  }else{
    setTimeout(getTeamAvg, 500);
  }
}
function displayRawWinrates(){
  for(a = 0; a < mapPool.length; a++){
    var div1 = document.getElementById("t1"+mapPool[a]);
    div1.innerText = team1stats[mapPool[a]].toFixed(0)+"%";

    var div2 = document.getElementById("t2"+mapPool[a]);
    div2.innerText = team2stats[mapPool[a]].toFixed(0)+"%";

    if(team2stats[mapPool[a]].toFixed(0) >= team1stats[mapPool[a]].toFixed(0)){
      div1.style.backgroundColor = "red";
      div2.style.backgroundColor = "green";
    }else{
      div1.style.backgroundColor = "green";
      div2.style.backgroundColor = "red";
    }
  }
}
