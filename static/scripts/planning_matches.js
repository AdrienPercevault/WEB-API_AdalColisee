// ToggleGames
function toggleDisplay(id) {
  var element = document.querySelector('#' + id);
  if (element.style.display === 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

// Init button to add a team by making it visible only for admin user's.
function init_add_match_button() {
  let add_match_button = document.getElementById('add-match-button');
  if (user_rank == "Admin") {
    add_match_button.removeAttribute("hidden");
  }
}

init_add_match_button();





// ---------------- //
// ----- LOAD ----- //
// ---------------- //

// Load Matches
function loadMatches() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/matches");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var date = new Date();
      var matches_nextHTML = ''; 
      var matches_prevHTML = ''; 
      var counter = 0;
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        object['match_team1'] = object['match_team1'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        object['match_team2'] = object['match_team2'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        match_date = new Date(object[`match_date`]);

        if (date <= match_date) {
          matches_nextHTML += createHTMLMatch(object, counter);
        }
        else {
          matches_prevHTML += createHTMLMatch(object, counter);
        }
        
        counter ++;
      }
      document.getElementById('matches_next').innerHTML = matches_nextHTML;
      document.getElementById('matches_prev').innerHTML = matches_prevHTML;
    }
  };
}

loadMatches()
getTeamsWinsLoses();

// Create HTML Match
function createHTMLMatch(object, counter) {
  var cardHTML = '';
  cardHTML += `
  <li>
    <table class="match-table mb-2">
      <tbody>
        <tr>
          <th scope="col" style="width:85%;">          
            <button class="match-button p-4" style="width: 100%;" onclick="toggleDisplay('sublist-`+counter+`')">
              <div style="width: 10%; float: left;">`+object[`match_date`]+`</div>
              <div style="width: 10%; float: left;">`+object[`match_hours`]+`</div>
              <div style="width: 5%; float: left;">`+object[`match_bo`]+`</div>
              <div style="width: 5%; float: left; -webkit-text-fill-color: #ECC19C">|</div>
              <div style="width: 30%; float: left;">`+object[`match_team1`]+`</div>
              <div style="width: 10%; float: left;">`+object[`match_score`]+`</div>
              <div style="width: 30%; float: left;">`+object[`match_team2`]+`</div>
            </button>
          </th>`

  if (user_rank == "Admin" || user_rank == "Captain") {
    cardHTML += `
      <th scope="col" style="width:5%;">
        <button style="width: 90%;" type="button" class="btn bi-plus mx-1" onclick="showGameCreatePage(\``+object[`match_id`]+`\`, \``+object[`match_team1`]+`\`, \``+object[`match_team2`]+`\`, \``+object[`match_games`].length+`\`)"></button>
      </th>`
  }
  if (user_rank == "Admin") {
    cardHTML += `
      <th scope="col" style="width:5%;">
        <button style="width: 90%;" type="button" class="btn bi-pencil-square mx-1" onclick="showMatchEditBox(\``+object[`match_id`]+`\`)"></button>
      </th>
      <th scope="col" style="width:5%;">
        <button style="width: 90%;" type="button" class="btn bi-trash mx-1" onclick="matchDelete(\``+object[`match_id`]+`\`)"></button>
      </th>`
  }
  cardHTML += `
        </tr>
      </tbody>
    </table>`

  cardHTML += `
    <ul id="sublist-`+counter+`" style="display: none;" class="mb-2">`

  for (index in object[`match_games`]) {
    game = object[`match_games`][index];
    if (game.hasOwnProperty('blue_side') && game.hasOwnProperty('red_side')) {
      cardHTML += `<li class="line-game">`

      if (game['blue_side']['result'] == "victory") {
        cardHTML += `<div style="width: 4%; float: left;" class="bi bi-award"> </div>`
      }
      else {
        cardHTML += `<div style="width: 4%; float: left;" class="bi bi-x"> </div>`
      }

      cardHTML += `
        <div style="width: 12.5%; float: left;">`+game[`blue_side`][`kills`]+`/`+game[`blue_side`][`deaths`]+`/`+game[`blue_side`][`assists`]+`</div>
        <div style="width: 30%; float: left;">`+game[`team_blue_side`]+`</div>
        <div style="width: 2%; float: left; -webkit-text-fill-color: #ECC19C">|</div>
        <div style="width: 30%; float: left;">`+game[`team_red_side`]+`</div>
        <div style="width: 12.5%; float: left;">`+game[`red_side`][`kills`]+`/`+game[`red_side`][`deaths`]+`/`+game[`red_side`][`assists`]+`</div>`

      if (game['red_side']['result'] == "victory") {
        cardHTML += `<div style="width: 4%; float: left;" class="bi bi-award"> </div>`
      }
      else {
        cardHTML += `<div style="width: 4%; float: left;" class="bi bi-x"> </div>`
      }
      
      if (user_rank == "Admin" || user_rank == "Captain") {
        cardHTML += `
          <div style="width: 2.5%; float: left;">
            <button type="button" class="btn bi-pencil-square mx-1" onclick="showGameCreatePage(\``+object[`match_id`]+`\`, \``+object[`match_team1`]+`\`, \``+object[`match_team2`]+`\`, \``+game[`game_id`]+`\`, \``+index+`\`)"></button>
          </div>
          <div style="width: 2.5%; float: left;">
            <button type="button" class="btn bi-trash mx-1" onclick="gameDelete(\``+object[`match_id`]+`\`, \``+game[`game_id`]+`\`, \``+index+`\`)"></button>
          </div>`
      }  
      cardHTML += `</li>`
    }
  }

  cardHTML += `
    </ul>
  </li>
  `
  return cardHTML
}





// ----------------- //
// ----- MATCH ----- //
// ----------------- //

// ADD
function showMatchCreateBox() {
  Swal.fire({
    title: "<h2 style='color:white'>Ajout d'un nouveaux match</h2>",
    background: "#323232",
    html: `
    <div class="mt-md-4 pb-5">
      <div class="form-outline form-white mb-2">
        <input id="match_team1" type="text" class="form-control form-control-lg" placeholder="Team 1" maxlength="30"/>
      </div>
      <div class="form-outline form-white mb-4">
        <input id="match_team2" type="text" class="form-control form-control-lg" placeholder="Team 2" maxlength="30"/>
      </div>

      <div class="form-outline form-white mb-2">
        <input id="match_date" type="date" class="form-control form-control-lg"/>
      </div>      
      <div class="form-outline form-white mb-2">
        <input id="match_hours" type="time" class="form-control form-control-lg"/>
      </div>

      <select id="match_bo" class="swal2-input mb-4 select">
        <option value="" selected disabled hidden>--Choisissez le bo--</option>
        <option value="BO1">BO1</option>
        <option value="BO3">BO3</option>
        <option value="BO5">BO5</option>
      </select>
    </div>`,
    focusConfirm: false,
    preConfirm: () => {
      if (document.getElementById('match_team1').value && document.getElementById('match_team2').value) {
        matchCreate();
      } else {
        Swal.showValidationMessage('Les deux équipes du match doivent être renseignées !')
      }
    }
  })
}

function matchCreate() {
  const match_team1 = document.getElementById('match_team1').value;
  const match_team2 = document.getElementById('match_team2').value;
  const match_date = document.getElementById('match_date').value;
  const match_hours = document.getElementById('match_hours').value;
  const match_bo = document.getElementById('match_bo').value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/matches");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "match_team1": match_team1,
    "match_team2": match_team2,
    "match_date": match_date,
    "match_hours": match_hours,
    "match_bo": match_bo,
    "match_games": []
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire("Le match entre " + match_team1 + " et " + match_team2 + " a été ajouté avec succès !");
      loadMatches();
    }
  };
}



// EDIT
function showMatchEditBox(match_id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/matches?match_id="+match_id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      if (object["match_bo"] == "BO1") {
        Swal.fire({
          title: "<h2 style='color:white'>Modification du match "+object["match_team1"]+" VS "+object["match_team2"]+"</h2>",
          background: "#323232",
          html: defaultHTMLEditBox(object) + `
            <select id="match_bo" class="swal2-input mb-4 select">
              <option value="" disabled hidden>--Choisissez le bo--</option>
              <option value="BO1" selected>BO1</option>
              <option value="BO3">BO3</option>
              <option value="BO5">BO5</option>
            </select>
          </div>`,
          focusConfirm: false,
          preConfirm: () => {
            if (document.getElementById('match_team1').value && document.getElementById('match_team2').value) {
              matchEdit(match_id);
            } else {
              Swal.showValidationMessage('Le nom des deux équipes doit être renseigné !')
            }
          }
        })
      }
      else if (object["match_bo"] == "BO3") {
        Swal.fire({
          title: "<h2 style='color:white'>Modification du match "+object["match_team1"]+" VS "+object["match_team2"]+"</h2>",
          background: "#323232",
          html: defaultHTMLEditBox(object) + `
            <select id="match_bo" class="swal2-input mb-4 select">
              <option value="" disabled hidden>--Choisissez le bo--</option>
              <option value="BO1">BO1</option>
              <option value="BO3" selected>BO3</option>
              <option value="BO5">BO5</option>
            </select>
          </div>`,
          focusConfirm: false,
          preConfirm: () => {
            if (document.getElementById('match_team1').value && document.getElementById('match_team2').value) {
              matchEdit(match_id);
            } else {
              Swal.showValidationMessage('Le nom des deux équipes doit être renseigné !')
            }
          }
        })
      }
      else if (object["match_bo"] == "BO5") {
        Swal.fire({
          title: "<h2 style='color:white'>Modification du match "+object["match_team1"]+" VS "+object["match_team2"]+"</h2>",
          background: "#323232",
          html: defaultHTMLEditBox(object) + `
            <select id="match_bo" class="swal2-input mb-4 select">
              <option value="" disabled hidden>--Choisissez le bo--</option>
              <option value="BO1">BO1</option>
              <option value="BO3">BO3</option>
              <option value="BO5" selected>BO5</option>
            </select>
          </div>`,
          focusConfirm: false,
          preConfirm: () => {
            if (document.getElementById('match_team1').value && document.getElementById('match_team2').value) {
              matchEdit(match_id);
            } else {
              Swal.showValidationMessage('Le nom des deux équipes doit être renseigné !')
            }
          }
        })
      }
    }
  };
}

function defaultHTMLEditBox(object) {
  return `<div class="mt-md-4 pb-5">
  <div class="form-outline form-white mb-2">
    <input id="match_team1" type="text" class="form-control form-control-lg" placeholder="Team 1" maxlength="30" value="`+object[`match_team1`]+`"/>
  </div>
  <div class="form-outline form-white mb-4">
    <input id="match_team2" type="text" class="form-control form-control-lg" placeholder="Team 2" maxlength="30" value="`+object[`match_team2`]+`"/>
  </div>

  <div class="form-outline form-white mb-2">
    <input id="match_date" type="date" class="form-control form-control-lg" value="`+object[`match_date`]+`"/>
  </div>      
  <div class="form-outline form-white mb-2">
    <input id="match_hours" type="time" class="form-control form-control-lg" value="`+object[`match_hours`]+`"/>
  </div>`
}

function matchEdit(match_id) {
  const match_team1 = document.getElementById('match_team1').value;
  const match_team2 = document.getElementById('match_team2').value;
  const match_date = document.getElementById('match_date').value;
  const match_hours = document.getElementById('match_hours').value;
  const match_bo = document.getElementById('match_bo').value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/matches?match_id="+match_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "match_team1": match_team1,
    "match_team2": match_team2,
    "match_date": match_date,
    "match_hours": match_hours,
    "match_bo": match_bo,
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      Swal.fire("Le match entre " + match_team1 + " et " + match_team2 + " a été modifié avec succès !");
      loadMatches();
    }
  };
}



// DELETE
function matchDelete(match_id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/matches?match_id="+match_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "match_id": match_id
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire("Match supprimé avec succès !");
      loadMatches();
    } 
  };
}





// ----------------- //
// ----- GAMES ----- //
// ----------------- //

// ADD
function showGameCreatePage(match_id, match_team1, match_team2, game_id, index) {
  string = '/game_details?match_id='+match_id+'&match_team1='+match_team1+'&match_team2='+match_team2+'&game_id='+game_id;
  if (index) {
    string += '&index='+index
  }
  location.href = string;
}

function gameDelete(match_id, game_id, index) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/games?match_id="+match_id+"&game_id="+game_id+"&index="+index);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "game_id": game_id
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire("Game supprimée avec succès !");
      loadMatches();
    } 
  };
}





// ---------------------------------- //
// ----- Set Teams wins & loses ----- //
// ---------------------------------- //

// Initialize wins loses by team
function getTeamsWinsLoses() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/matches");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      teams_wins_loses = {};
      for (match of objects) {
        score = "0-0";
        score_team1 = 0;
        score_team2 = 0;
        for (game of match['match_games']) {
          if (game.hasOwnProperty("team_blue_side") && game.hasOwnProperty("team_red_side")) {
            result = initWinsLoses(teams_wins_loses, game)
            teams_wins_loses = result[0];
            if (match['match_team1'] == game['team_blue_side']) {
              score_team1 = score_team1 + result[1];
            }
            else if (match['match_team1'] == game['team_red_side']) {
              score_team1 = score_team1 + result[2];
            }
            if (match['match_team2'] == game['team_blue_side']) {
              score_team2 = score_team2 + result[1];
            }
            else if (match['match_team2'] == game['team_red_side']) {
              score_team2 = score_team2 + result[2];
            }

            score = score_team1 + "-" + score_team2;
          }
          teams_list = Object.keys(teams_wins_loses);
          for (team of teams_list) {
            updateTeamWinsLoses(team, teams_wins_loses[team]['wins'], teams_wins_loses[team]['loses'])
          }
        }
        updateMatchScore(match['match_id'], score);
      }
    }
  };
}

// Initialise wins loses list & score
function initWinsLoses(teams_wins_loses, game, blue_score, red_score) {
  // add team name in dict
  if (!(game['team_blue_side'] in teams_wins_loses)) {
    teams_wins_loses[game['team_blue_side']] = {
      'wins': 0,
      'loses': 0
    }
  }
  if (!(game['team_red_side'] in teams_wins_loses)) {
    teams_wins_loses[game['team_red_side']] = {
      'wins': 0,
      'loses': 0
    }
  }
  // blue side
  if (game['blue_side']['result'] == 'victory') {
    teams_wins_loses[game['team_blue_side']]['wins'] = teams_wins_loses[game['team_blue_side']]['wins'] + 1;
    blue_score = 1;
  }
  else if (game['blue_side']['result'] == 'defeat') {
    teams_wins_loses[game['team_blue_side']]['loses'] = teams_wins_loses[game['team_blue_side']]['loses'] + 1;
    blue_score = 0;
  }
  // red side
  if (game['red_side']['result'] == 'victory') {
    teams_wins_loses[game['team_red_side']]['wins'] = teams_wins_loses[game['team_red_side']]['wins'] + 1;
    red_score = 1;
  }
  else if (game['red_side']['result'] == 'defeat') {
    teams_wins_loses[game['team_red_side']]['loses'] = teams_wins_loses[game['team_red_side']]['loses'] + 1;
    red_score = 0;
  }
  return [teams_wins_loses, blue_score, red_score]
}

// Update teams wins & loses
function updateTeamWinsLoses(team_name, wins, loses) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "team_wins": wins,
    "team_loses": loses,
    "team_score": wins - loses
  }));
}

// Update match_score
function updateMatchScore(match_id, score) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/matches?match_id="+match_id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "match_score": score
  }));
  loadMatches();
}
