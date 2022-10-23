// ----- SCHEDULES ----- //
// --------------------- //

// Load matches
function loadPlanning() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/schedules");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var cardHTMLindicators = ''; 
      var cardHTML = ''; 
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        if (object['phase'] == 'group') { 
          // Load indicators
          for (week_index in object['weeks']) {
            week_number = parseInt(week_index) + 1
            week = object['weeks'][week_index]
            cardHTMLindicators += `
            <button id="indicatorWeek`+week_number+`" type="button" data-bs-target="#carouselSchedule" data-bs-slide-to="`+week_index+`" aria-current="true" aria-label="Slide `+week_number+`"></button>
            `
          }
          
          // Load matches
          for (week_index in object['weeks']) {
            week_number = parseInt(week_index) + 1
            week = object['weeks'][week_index]
            cardHTML += `
            <div id="week`+week_number+`" class="carousel-item p-5">
              <h1>Semaine `+week_number+`</h1>
                <div class="row my-5">
                  <div class="col">
                    <div class="league-name mb-5"><h2>League Gladiateur</div>
                    <table class="table">
                      <thead>
                        <tr>
                          <th style="width:5%;"></th>
                          <th style="width:40%;"></th>
                          <th style="width:10%;"></th>
                          <th style="width:40%;"></th>
                          <th style="width:5%;"></th>
                        </tr>
                      </thead>
                      <tbody>`
            
            for (match_index in week['gladiateur']) {
              match = week['gladiateur'][match_index]
              cardHTML += `<tr>`
              if (match['side_winner'] == "blue") {
                cardHTML += `<td class="bi-trophy"></td>`
              }
              else {
                if (user_rank == "Admin" || user_rank == "Captain") {
                  cardHTML += `<td><button type="button" class="btn-icon bi-plus" onclick="changeWinnerSide(\``+week_index+`\`, \`gladiateur\`, \``+match_index+`\`, \`blue\`)"></button></td>`
                } else {
                  cardHTML += `<td></td>`
                }
              }
              cardHTML += `
              <td>`+match[`team_blue_side`]+`</td>
              <td><a class="add-game" href="/add_game?game_id=`+match[`game_id`]+`&team_blue_side=`+match[`team_blue_side`]+`&team_red_side=`+match[`team_red_side`]+`&side_winner=`+match[`side_winner`]+`">VS</a></td>
              <td>`+match[`team_red_side`]+`</td>`
              if (match['side_winner'] == "red") {
                cardHTML += `<td class="bi-trophy"></td>`
              }
              else {
                if (user_rank == "Admin" || user_rank == "Captain") {
                  cardHTML += `<td><button type="button" class="btn-icon bi-plus" onclick="changeWinnerSide(\``+week_index+`\`, \`gladiateur\`, \``+match_index+`\`, \`red\`)"></button></td>`
                } else {
                  cardHTML += `<td></td>`
                }
              }
              cardHTML += `</tr>`
            }
            cardHTML += `
                </tbody>
              </table>
            </div>
            <div class="col">
              <div class="league-name mb-5"><h2>League Berserker</div>
              <table class="table">
                <thead>
                  <tr>
                    <th style="width:5%;"></th>
                    <th style="width:40%;"></th>
                    <th style="width:10%;"></th>
                    <th style="width:40%;"></th>
                    <th style="width:5%;"></th>
                  </tr>
                </thead>
                <tbody>`

            for (match_index in week['berserker']) {
              match = week['berserker'][match_index]
              cardHTML += `<tr>`
              if (match['side_winner'] == "blue") {
                cardHTML += `<td class="bi-trophy"></a></td>`
              }
              else {
                if (user_rank == "Admin" || user_rank == "Captain") {
                  cardHTML += `<td><button type="button" class="btn-icon bi-plus" onclick="changeWinnerSide(\``+week_index+`\`, \`berserker\`, \``+match_index+`\`, \`blue\`)"></button></td>`
                } else {
                  cardHTML += `<td></td>`
                }
              }
              cardHTML += `
              <td>`+match[`team_blue_side`]+`</td>
              <td><a class="add-game" href="/add_game?game_id=`+match[`game_id`]+`&team_blue_side=`+match[`team_blue_side`]+`&team_red_side=`+match[`team_red_side`]+`&side_winner=`+match[`side_winner`]+`">VS</a></td>
              <td>`+match[`team_red_side`]+`</td>`
              
              if (match['side_winner'] == "red") {
                cardHTML += `<td class="bi-trophy"></td>`
              }
              else {
                if (user_rank == "Admin" || user_rank == "Captain") {
                  cardHTML += `<td><button type="button" class="btn-icon bi-plus" onclick="changeWinnerSide(\``+week_index+`\`, \`berserker\`, \``+match_index+`\`, \`red\`)"></button></td>`
                } else {
                  cardHTML += `<td></td>`
                }
              }
              cardHTML += `</tr>`
            }
            cardHTML += `
                    </tbody>
                  </table>
                </div>
              </div>
              <p class="small">Du 03 octobre au 06 novembre 2022</p>
            </div>`
          }
        }
      }
      document.getElementById('carouselScheduleIndicator').innerHTML = cardHTMLindicators;
      document.getElementById('group-schedule').innerHTML = cardHTML;

      document.getElementById('week1').className = "carousel-item p-5 active";
      document.getElementById('indicatorWeek1').className = "active";
    }
  };
}

loadPlanning()



// Change the icon for the winner
function changeWinnerSide(week_index, league, match_index, side) {
  side_winner = "weeks."+week_index+"."+league+"."+match_index+".side_winner"
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/schedules?phase=group");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    [side_winner]: side,
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      loadPlanning();
      getTeamsWinsLoses(week_index, league, match_index)
    }
  };
}





// ----- Set Teams wins & loses ----- //
// ---------------------------------- //

// Initialize wins loses by team
function getTeamsWinsLoses(current_week_index, current_league, current_match_index) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/schedules?phase=group");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      current_match = object['weeks'][current_week_index][current_league][current_match_index]
      teams_wins_loses = {}
      // Load matches create wins loses list
      for (week_index in object['weeks']) {
        week = object['weeks'][week_index]
        for (match_index in week['gladiateur']) {
          teams_wins_loses = initWinsLoses(teams_wins_loses, week['gladiateur'], match_index)
        }
        for (match_index in week['berserker']) {
          teams_wins_loses = initWinsLoses(teams_wins_loses, week['berserker'], match_index)
        }
      }
      teams_list = Object.keys(teams_wins_loses);
      for (team of teams_list) {
        if (team == current_match['team_blue_side'] || team == current_match['team_red_side']) {
          updateTeamWinsLoses(team, teams_wins_loses[team]['wins'], teams_wins_loses[team]['loses'])
        }
      }
    }
  };
}

// Initialise wins loses list for one league
function initWinsLoses(teams_wins_loses, league, match_index) {
  match = league[match_index]
  if (!(match['team_blue_side'] in teams_wins_loses)) {
    teams_wins_loses[match['team_blue_side']] = {
      'wins': 0,
      'loses': 0
    }
  }
  if (!(match['team_red_side'] in teams_wins_loses)) {
    teams_wins_loses[match['team_red_side']] = {
      'wins': 0,
      'loses': 0
    }
  }
  if (match['side_winner'] == 'blue') {
    teams_wins_loses[match['team_blue_side']]['wins'] = teams_wins_loses[match['team_blue_side']]['wins'] + 1
    teams_wins_loses[match['team_red_side']]['loses'] = teams_wins_loses[match['team_red_side']]['loses'] + 1
  }
  else if (match['side_winner'] == 'red') {
    teams_wins_loses[match['team_red_side']]['wins'] = teams_wins_loses[match['team_red_side']]['wins'] + 1
    teams_wins_loses[match['team_blue_side']]['loses'] = teams_wins_loses[match['team_blue_side']]['loses'] + 1
  }
  return teams_wins_loses
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
