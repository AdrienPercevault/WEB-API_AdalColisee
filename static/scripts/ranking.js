// ----- LOAD ----- //
// ---------------- //

// Load ranks
function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/teams");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML_gladiator = ''; 
      var trHTML_berserker = ''; 
      const objects = JSON.parse(this.responseText);
      gladiator_rank = 1;
      berserker_rank = 1;
      for (let object of objects) {
        add_team_win = '<td><button type="button" class="btn btn-outline-success bi-plus" onclick="teamAddWin(\''+object['team_name']+'\', \''+object['team_wins']+'\', \''+object['team_score']+'\')"></button></td>'
        remove_team_win = '<td><button type="button" class="btn btn-outline-danger bi-dash" onclick="teamRemoveWin(\''+object['team_name']+'\', \''+object['team_wins']+'\', \''+object['team_score']+'\')"></button></td>'
        add_team_lose = '<td><button type="button" class="btn btn-outline-success bi-plus" onclick="teamAddLose(\''+object['team_name']+'\', \''+object['team_loses']+'\', \''+object['team_score']+'\')"></button></td>'
        remove_team_lose = '<td><button type="button" class="btn btn-outline-danger bi-dash" onclick="teamRemoveLose(\''+object['team_name']+'\', \''+object['team_loses']+'\', \''+object['team_score']+'\')"></button></td>'
        if (object['team_league'].toLowerCase() == 'gladiateur') {
          trHTML_gladiator += '<tr>';
          trHTML_gladiator += '<td>'+ gladiator_rank++ +'</td>';
          trHTML_gladiator += '<td>'+object['team_tag']+'</td>';
          trHTML_gladiator += '<td>'+object['team_name']+'</td>'; // TODO Empêcher les injections SQL
          trHTML_gladiator += '<td style="text-align:center;">'+object['team_wins']+' ';
          if (user_rank == "Admin") {
            trHTML_gladiator += add_team_win+''+remove_team_win;
          }
          trHTML_gladiator += '</td><td style="text-align:center;">'+object['team_loses']+' ';
          if (user_rank == "Admin") {
            trHTML_gladiator += add_team_lose+''+remove_team_lose;
          }
          trHTML_gladiator += '</td></tr>';
        }
        else if (object['team_league'].toLowerCase() == "berserker") {
          trHTML_berserker += '<tr>';
          trHTML_berserker += '<td>'+ berserker_rank++ +'</td>';
          trHTML_berserker += '<td>'+object['team_tag']+'</td>';
          trHTML_berserker += '<td>'+object['team_name']+'</td>'; // TODO Empêcher les injections SQL
          trHTML_berserker += '<td style="text-align:center;">'+object['team_wins']+' ';
          if (user_rank == "Admin") {
            trHTML_berserker += add_team_win+''+remove_team_win;
          }
          trHTML_berserker += '</td><td style="text-align:center;">'+object['team_loses']+' ';
          if (user_rank == "Admin") {
            trHTML_berserker += add_team_lose+''+remove_team_lose;
          }
          trHTML_berserker += "</td></tr>";
        }
      }
      document.getElementById('mytable-gladiator').innerHTML = trHTML_gladiator;
      document.getElementById('mytable-berserker').innerHTML = trHTML_berserker;
    }
  };
}

loadTable();





// ----- OPERATIONS ----- //
// ---------------------- //

// Add win
function teamAddWin(team_name, team_wins, team_score) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  team_wins++
  team_score++
  xhttp.send(JSON.stringify({ 
    "team_wins": team_wins,
    "team_score": team_score
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      loadTable();
    }
  };
}

// Remove win
function teamRemoveWin(team_name, team_wins, team_score) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  team_wins--
  team_score--
  xhttp.send(JSON.stringify({ 
    "team_wins": team_wins,
    "team_score": team_score
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      loadTable();
    }
  };
}

// Add lose
function teamAddLose(team_name, team_loses, team_score) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  team_loses++
  team_score--
  xhttp.send(JSON.stringify({ 
    "team_loses": team_loses,
    "team_score": team_score
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      loadTable();
    }
  };
}

// Remove lose
function teamRemoveLose(team_name, team_loses, team_score) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  team_loses--
  team_score++
  xhttp.send(JSON.stringify({ 
    "team_loses": team_loses,
    "team_score": team_score
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      loadTable();
    }
  };
}
