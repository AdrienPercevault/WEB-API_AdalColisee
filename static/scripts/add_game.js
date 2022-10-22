//
// GET URL PARAMS
//
function getGameId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('game_id');
}

function getTeamBlueSide() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('team_blue_side');
}

function getTeamRedSide() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('team_red_side');
}

function getSideWinner() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('side_winner');
}





// ----- LOAD ----- //
// ---------------- //

// Load URL params
function loadURLParams() {
  team_blue_side = getTeamBlueSide();
  document.getElementById('team-blue-side').innerHTML = team_blue_side;

  team_red_side = getTeamRedSide();
  document.getElementById('team-red-side').innerHTML = team_red_side;

  side_winner = getSideWinner();
  if (side_winner == "blue") {
    document.getElementById('blue-side-winner-left').className = "col bi-trophy";
    document.getElementById('blue-side-winner-right').className = "col bi-trophy";
  }
  else if (side_winner == "red") {
    document.getElementById('red-side-winner-left').className = "col bi-trophy";
    document.getElementById('red-side-winner-right').className = "col bi-trophy";
  }
}
loadURLParams();

// Load default values if game exist
function loadValueByGameID() {
  game_id = getGameId()
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/games");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        if (game_id == object['game_id']) {
          blue_side = object['blue_side']
          red_side = object['red_side']
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
          document.getElementById('duration').value = object['duration'];
          // BUTTON
          document.getElementById('add-game-button').disabled = true;
          document.getElementById('update-game-button').disabled = false;
        }
      }
    }
  };
}
loadValueByGameID()





// ----- ADD GAME ----- //
// -------------------- //
function addGame() {
  game_id = getGameId();
  team_blue_side = getTeamBlueSide();
  team_red_side = getTeamRedSide();
  side_winner = getSideWinner();
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
  xhttp.open("POST", "/games");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "game_id": game_id,
    "team_blue_side": team_blue_side,
    "team_red_side": team_red_side,
    "side_winner": side_winner,
    "duration": duration,
    "blue_side": {
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
    }
  };
}





// ----- UPDATE GAME ----- //
// ----------------------- //
function updateGame() {
  game_id = getGameId();
  team_blue_side = getTeamBlueSide();
  team_red_side = getTeamRedSide();
  side_winner = getSideWinner();
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
  xhttp.open("PUT", "/games?game_id="+game_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "game_id": game_id,
    "team_blue_side": team_blue_side,
    "team_red_side": team_red_side,
    "side_winner": side_winner,
    "duration": duration,
    "blue_side": {
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
    }
  };
}





// ----- ENABLE INPUT ----- //
// ------------------------ //
function enableInput() {
  if (user_rank == 'Captain' || user_rank == 'Admin') {
    // KDA
    document.getElementById('blue-side-kills').removeAttribute("disabled");
    document.getElementById('red-side-kills').removeAttribute("disabled");
    document.getElementById('blue-side-deaths').removeAttribute("disabled");
    document.getElementById('red-side-deaths').removeAttribute("disabled");
    document.getElementById('blue-side-assists').removeAttribute("disabled");
    document.getElementById('red-side-assists').removeAttribute("disabled");
    // GOLDS
    document.getElementById('blue-side-golds').removeAttribute("disabled");
    document.getElementById('red-side-golds').removeAttribute("disabled");
    // STRUCTURES
    document.getElementById('blue-side-towers').removeAttribute("disabled");
    document.getElementById('red-side-towers').removeAttribute("disabled");
    document.getElementById('blue-side-inibitors').removeAttribute("disabled");
    document.getElementById('red-side-inibitors').removeAttribute("disabled");
    // MONSTERS
    document.getElementById('blue-side-heralds').removeAttribute("disabled");
    document.getElementById('red-side-heralds').removeAttribute("disabled");
    document.getElementById('blue-side-dragons').removeAttribute("disabled");
    document.getElementById('red-side-dragons').removeAttribute("disabled");
    document.getElementById('blue-side-barons').removeAttribute("disabled");
    document.getElementById('red-side-barons').removeAttribute("disabled");
    // DURATION
    document.getElementById('duration').removeAttribute("disabled");
    // BUTTON
    document.getElementById('add-game-button').removeAttribute("disabled");
  }
}
enableInput()





// ----- CREATE GLOBALS STATS ----- //
// -------------------------------- //

// Create games stats by team
function createTeamsStats() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/games");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var team_dict_stats = {};
      const objects = JSON.parse(this.responseText);
      // Initialise team dict
      for (let object of objects) {
        if (!team_dict_stats.hasOwnProperty(object['team_blue_side'])) {
          team_dict_stats[object['team_blue_side']] = initDict();
        }
        if (!team_dict_stats.hasOwnProperty(object['team_red_side'])) {
          team_dict_stats[object['team_red_side']] = initDict();
        }
      }
      for (let object of objects) {
        blue_win=0, blue_lose=0, red_win=0, red_lose=0;
        if (object['side_winner'] == "blue") {
          blue_win=1, red_lose=1
        } 
        else if (object['side_winner'] == "red") {
          red_win=1, blue_lose=1
        }
        blue_side = object['blue_side']
        team_blue_name = object['team_blue_side']
        team_dict_stats[team_blue_name] = initDict(
          team_dict_stats[team_blue_name],
          object['duration'],
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
        red_side = object['red_side']
        team_red_name = object['team_red_side']
        team_dict_stats[team_red_name] = initDict(
          team_dict_stats[team_red_name],
          object['duration'],
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
      updateStats(team_dict_stats)
    }
  };
}

// Init teams dict
function initDict(team_list_name, duration="00:00", kills=0, deaths=0, assists=0, towers=0, inibitors=0, barons=0, dragons=0, heralds=0, golds=0, wins=0, loses=0) {
  console.log(duration)
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
  season_id = {"season": "S3"}
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
