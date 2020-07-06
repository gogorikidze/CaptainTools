const serversideApiKey = "71f1b01d-3170-4613-ab20-b6d72ca7dc2b"
const mapPool = ["de_vertigo", "de_overpass", "de_inferno", "de_mirage", "de_dust2", "de_cache", "de_train", "de_nuke"];



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
function getMapStats(playerID){
  getFaceitData("https://open.faceit.com/data/v4/players/"+playerID+"/stats/csgo", function(response){
    if(response != false){ // if player has csgo stats
      for(a = 0; a < mapPool.length; a++){
          console.log(mapPool[a] + ": " + getMapWinrate(response.segments, mapPool[a]).toFixed(2) +"%");
      }
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

//getMapStats("0b74bdfd-b6c2-4104-a62d-b882d5be5bc3");
//getMapStats("2a6d3d0c-f124-4d00-bb51-8b5ce6861956");
//getProfileData("Ass-");
