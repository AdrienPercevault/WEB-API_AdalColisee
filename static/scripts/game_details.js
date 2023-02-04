//
// GET URL PARAMS
//
function getMatchId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('match_id');
}

function getTeam1() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('match_team1');
}

function getTeam2() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('match_team2');
}

function getGamesId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return parseInt(urlParams.get('game_id'));
}

function getIndex() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return parseInt(urlParams.get('index'));
}



// ----- LOAD ----- //
// ---------------- //

// Load select teams side
function loadSelectTeamName(element_id) {
  const option_team1 = document.createElement("option");
  option_team1.value = getTeam1();
  option_team1.text = getTeam1();
  
  const option_team2 = document.createElement("option");
  option_team2.value = getTeam2();
  option_team2.text = getTeam2();
  
  const select = document.getElementById(element_id);
  select.add(option_team1, null);
  select.add(option_team2, null);  
}

loadSelectTeamName("team_blue_side");
loadSelectTeamName("team_red_side");



// Load victory trophy
function loadURLParams() {
  team_blue_result = document.getElementById('team_blue_result').value;
  team_red_result = document.getElementById('team_red_result').value;

  if (team_blue_result == "victory") {
    document.getElementById('blue_side_winner_left').className = "col bi-trophy";
    document.getElementById('blue_side_winner_right').className = "col bi-trophy";
  }
  if (team_red_result == "victory") {
    document.getElementById('red_side_winner_left').className = "col bi-trophy";
    document.getElementById('red_side_winner_right').className = "col bi-trophy";
  }
}
loadURLParams();



// Load default values if game exist
function loadValueByGameID() {
  match_id = getMatchId();
  game_id = getGamesId();
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/matches?match_id="+match_id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      for (index in object[`match_games`]) {
        game = object['match_games'][index]
        if (game_id == game['game_id']) {
          blue_side = game['blue_side']
          red_side = game['red_side']
          // TEAMS NAME
          document.getElementById('team_blue_side').value = game['team_blue_side'];
          document.getElementById('team_red_side').value = game['team_red_side'];
          // RESULT
          document.getElementById('team_blue_result').value = blue_side['result'];
          document.getElementById('team_red_result').value = red_side['result'];
          // KDA
          document.getElementById('blue-side-kills').value = blue_side['kills'];
          document.getElementById('red-side-kills').value = red_side['kills'];
          document.getElementById('blue-side-deaths').value = blue_side['deaths'];
          document.getElementById('red-side-deaths').value = red_side['deaths'];
          document.getElementById('blue-side-assists').value = blue_side['assists'];
          document.getElementById('red-side-assists').value = red_side['assists'];
          // GOLDS
          document.getElementById('blue-side-golds').value = blue_side['golds'];
          document.getElementById('red-side-golds').value = red_side['golds'];
          // STRUCTURES
          document.getElementById('blue-side-towers').value = blue_side['towers'];
          document.getElementById('red-side-towers').value = red_side['towers'];
          document.getElementById('blue-side-inibitors').value = blue_side['inibitors'];
          document.getElementById('red-side-inibitors').value = red_side['inibitors'];
          // MONSTERS
          document.getElementById('blue-side-heralds').value = blue_side['heralds'];
          document.getElementById('red-side-heralds').value = red_side['heralds'];
          document.getElementById('blue-side-dragons').value = blue_side['dragons'];
          document.getElementById('red-side-dragons').value = red_side['dragons'];
          document.getElementById('blue-side-barons').value = blue_side['barons'];
          document.getElementById('red-side-barons').value = red_side['barons'];
          // DURATION
          document.getElementById('duration').value = game['duration'];
          // BUTTON
          document.getElementById('add-game-button').disabled = true;
          document.getElementById('update-game-button').disabled = false;
        }
      }
    }
  };
}
loadValueByGameID()





// -------------------- //
// ----- ADD GAME ----- //
// -------------------- //
function addGame() {
  match_id = getMatchId();
  game_id = getGamesId() + Date.now();;

  // TEAMS NAME
  team_blue_side = document.getElementById('team_blue_side').value;
  team_red_side = document.getElementById('team_red_side').value;
  // RESULT
  result_blue = document.getElementById('team_blue_result').value;
  result_red = document.getElementById('team_red_result').value;
  // KDA
  blue_side_kills = document.getElementById('blue-side-kills').value;
  red_side_kills = document.getElementById('red-side-kills').value;
  blue_side_deaths = document.getElementById('blue-side-deaths').value;
  red_side_deaths = document.getElementById('red-side-deaths').value;
  blue_side_assists = document.getElementById('blue-side-assists').value;
  red_side_assists = document.getElementById('red-side-assists').value;
  // GOLDS
  blue_side_golds = document.getElementById('blue-side-golds').value;
  red_side_golds = document.getElementById('red-side-golds').value;
  // STRUCTURES
  blue_side_towers = document.getElementById('blue-side-towers').value;
  red_side_towers = document.getElementById('red-side-towers').value;
  blue_side_inibitors = document.getElementById('blue-side-inibitors').value;
  red_side_inibitors = document.getElementById('red-side-inibitors').value;
  // MONSTERS
  blue_side_heralds = document.getElementById('blue-side-heralds').value;
  red_side_heralds = document.getElementById('red-side-heralds').value;
  blue_side_dragons = document.getElementById('blue-side-dragons').value;
  red_side_dragons = document.getElementById('red-side-dragons').value;
  blue_side_barons = document.getElementById('blue-side-barons').value;
  red_side_barons = document.getElementById('red-side-barons').value;
  // DURATION
  duration = document.getElementById('duration').value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/games?match_id="+match_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "game_id": game_id,
    "team_blue_side": team_blue_side,
    "team_red_side": team_red_side,
    "duration": duration,
    "blue_side": {
      "result": result_blue,
      "kills": parseInt(blue_side_kills),
      "deaths": parseInt(blue_side_deaths),
      "assists": parseInt(blue_side_assists),
      "towers": parseInt(blue_side_towers),
      "inibitors": parseInt(blue_side_inibitors),
      "heralds": parseInt(blue_side_heralds),
      "dragons": parseInt(blue_side_dragons),
      "barons": parseInt(blue_side_barons),
      "golds": parseInt(blue_side_golds)
    },
    "red_side": {
      "result": result_red,
      "kills": parseInt(red_side_kills),
      "deaths": parseInt(red_side_deaths),
      "assists": parseInt(red_side_assists),
      "towers": parseInt(red_side_towers),
      "inibitors": parseInt(red_side_inibitors),
      "heralds": parseInt(red_side_heralds),
      "dragons": parseInt(red_side_dragons),
      "barons": parseInt(red_side_barons),
      "golds": parseInt(red_side_golds)
    }
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire("Game " + team_blue_side + " VS "  + team_red_side + " ajouté avec succès !");
      loadValueByGameID();
      createTeamsStats();
      // returnPlanningPage();
    }
  };
}





// ----------------------- //
// ----- UPDATE GAME ----- //
// ----------------------- //
function updateGame() {
  match_id = getMatchId();
  game_id = getGamesId();
  index = getIndex();
  
  // TEAMS NAME
  team_blue_side = document.getElementById('team_blue_side').value;
  team_red_side = document.getElementById('team_red_side').value;
  // RESULT
  result_blue = document.getElementById('team_blue_result').value;
  result_red = document.getElementById('team_red_result').value;
  // KDA
  blue_side_kills = document.getElementById('blue-side-kills').value;
  red_side_kills = document.getElementById('red-side-kills').value;
  blue_side_deaths = document.getElementById('blue-side-deaths').value;
  red_side_deaths = document.getElementById('red-side-deaths').value;
  blue_side_assists = document.getElementById('blue-side-assists').value;
  red_side_assists = document.getElementById('red-side-assists').value;
  // GOLDS
  blue_side_golds = document.getElementById('blue-side-golds').value;
  red_side_golds = document.getElementById('red-side-golds').value;
  // STRUCTURES
  blue_side_towers = document.getElementById('blue-side-towers').value;
  red_side_towers = document.getElementById('red-side-towers').value;
  blue_side_inibitors = document.getElementById('blue-side-inibitors').value;
  red_side_inibitors = document.getElementById('red-side-inibitors').value;
  // MONSTERS
  blue_side_heralds = document.getElementById('blue-side-heralds').value;
  red_side_heralds = document.getElementById('red-side-heralds').value;
  blue_side_dragons = document.getElementById('blue-side-dragons').value;
  red_side_dragons = document.getElementById('red-side-dragons').value;
  blue_side_barons = document.getElementById('blue-side-barons').value;
  red_side_barons = document.getElementById('red-side-barons').value;
  // DURATION
  duration = document.getElementById('duration').value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/games?match_id="+match_id+"&index="+index);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "game_id": game_id,
    "team_blue_side": team_blue_side,
    "team_red_side": team_red_side,
    "duration": duration,
    "blue_side": {
      "result": result_blue,
      "kills": parseInt(blue_side_kills),
      "deaths": parseInt(blue_side_deaths),
      "assists": parseInt(blue_side_assists),
      "towers": parseInt(blue_side_towers),
      "inibitors": parseInt(blue_side_inibitors),
      "heralds": parseInt(blue_side_heralds),
      "dragons": parseInt(blue_side_dragons),
      "barons": parseInt(blue_side_barons),
      "golds": parseInt(blue_side_golds)
    },
    "red_side": {
      "result": result_red,
      "kills": parseInt(red_side_kills),
      "deaths": parseInt(red_side_deaths),
      "assists": parseInt(red_side_assists),
      "towers": parseInt(red_side_towers),
      "inibitors": parseInt(red_side_inibitors),
      "heralds": parseInt(red_side_heralds),
      "dragons": parseInt(red_side_dragons),
      "barons": parseInt(red_side_barons),
      "golds": parseInt(red_side_golds)
    }
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire("Game " + team_blue_side + " VS "  + team_red_side + " modifié avec succès !");
      loadValueByGameID();
      createTeamsStats();
      // returnPlanningPage();
    }
  };
}





// Return planning
function returnPlanningPage() {
  location.href = '/planning';
}





// ----- CREATE GLOBALS STATS ----- //
// -------------------------------- //

// Create games stats by team
function createTeamsStats() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/matches");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var team_dict_stats = {};
      const objects = JSON.parse(this.responseText);
      // Initialise team dict
      console.log('get matches stats')
      for (let match of objects) {
        for (let game of match['match_games']) {
          if (game.hasOwnProperty("team_blue_side") && game.hasOwnProperty("team_red_side")) {
            if (!team_dict_stats.hasOwnProperty(game['team_blue_side'])) {
              team_dict_stats[game['team_blue_side']] = initDict();
            }
            if (!team_dict_stats.hasOwnProperty(game['team_red_side'])) {
              team_dict_stats[game['team_red_side']] = initDict();
            }
          }
        }
        for (let game of match['match_games']) {
          if (game.hasOwnProperty("team_blue_side") && game.hasOwnProperty("team_red_side")) {
            blue_side = game['blue_side']
            red_side = game['red_side']
            blue_win=0, blue_lose=0, red_win=0, red_lose=0;
            if (blue_side['result'] == "victory") {
              blue_win=1;
            }
            if (blue_side['result'] == "defeat") {
              blue_lose=1;
            }
            if (red_side['result'] == "victory") {
              red_win=1;
            }
            if (red_side['result'] == "defeat") {
              red_lose=1;
            }
            team_blue_name = game['team_blue_side']
            team_dict_stats[team_blue_name] = initDict(
              team_dict_stats[team_blue_name],
              game['duration'],
              blue_side['kills'],
              blue_side['deaths'],
              blue_side['assists'],
              blue_side['towers'],
              blue_side['inibitors'],
              blue_side['barons'],
              blue_side['dragons'],
              blue_side['heralds'],
              blue_side['golds'],
              blue_win,
              blue_lose
            );
            team_red_name = game['team_red_side']
            team_dict_stats[team_red_name] = initDict(
              team_dict_stats[team_red_name],
              game['duration'],
              red_side['kills'],
              red_side['deaths'],
              red_side['assists'],
              red_side['towers'],
              red_side['inibitors'],
              red_side['barons'],
              red_side['dragons'],
              red_side['heralds'],
              red_side['golds'],
              red_win,
              red_lose
            );
          }
        }
      }
      console.log(team_dict_stats)
      updateStats(team_dict_stats);
    }
  };
}

// Init teams dict
function initDict(team_list_name, duration="00:00", kills=0, deaths=0, assists=0, towers=0, inibitors=0, barons=0, dragons=0, heralds=0, golds=0, wins=0, loses=0) {
  if (team_list_name !== undefined) {
    return {
      "game_duration": addTimes([team_list_name["game_duration"], duration]),
      "kills": team_list_name["kills"] + kills,
      "deaths": team_list_name["deaths"] + deaths,
      "assists": team_list_name["assists"] + assists,
      "towers": team_list_name["towers"] + towers,
      "inibitors": team_list_name["inibitors"] + inibitors,
      "barons": team_list_name["barons"] + barons,
      "dragons": team_list_name["dragons"] + dragons,
      "heralds": team_list_name["heralds"] + heralds,
      "golds": team_list_name["golds"] + golds,
      "wins": team_list_name["wins"] + wins,
      "loses": team_list_name["loses"] + loses
    }
  }
  return {
    "game_duration": duration,
    "kills": kills,
    "deaths": deaths,
    "assists": assists,
    "towers": towers,
    "inibitors": inibitors,
    "barons": barons,
    "dragons": dragons,
    "heralds": heralds,
    "golds": golds,
    "wins": wins,
    "loses": loses
  }
}

// Update global stats
function updateStats(team_dict_stats) {
  season_id = {"season": "S4"}
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/stats?season="+season_id['season']);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(Object.assign({}, season_id, team_dict_stats)));
}





// ----- TIMES OPERATIONS ----- //
// ---------------------------- //

// Add
function addTimes(time_list) {
  t1_mins = 0;
  t1_secs = 0;
  for (time of time_list) {
    if (time !== '') {
      t2_mins = parseInt(time.split(':')[0]);
      t2_secs = parseInt(time.split(':')[1]);
      seconds = t1_secs + t2_secs
      t1_mins = t1_mins + t2_mins + Math.floor(seconds / 60)
      t1_secs = seconds % 60
    }
  }  
  return t1_mins+':'+t1_secs
}
