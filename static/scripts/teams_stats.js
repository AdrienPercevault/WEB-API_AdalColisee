// ----- LOAD PARAM ----- //
// ---------------------- //

// Load team name
function getTeamName() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('team_name');
}

function loadName() {
  team_name = getTeamName()
  document.getElementById('team_name').innerHTML += team_name;
}

loadName()





// ----- LOAD STATS ----- //
// ---------------------- //

// Load games stats
function loadGameStats() {
  team_name = getTeamName()
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/games?team_name="+team_name);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var duration_list = [];
      var opponent_list = [];
      var kills_list = [];
      var deaths_list = [];
      var assists_list = [];
      var towers_list = [];
      var inibitors_list = [];
      var heralds_list = [];
      var dragons_list = [];
      var barons_list = [];
      var golds_list = [];
      wins = 0;
      loses = 0;
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        duration_list.push(object['duration']);
        if (object['team_blue_side'] == team_name) {
          opponent_list.push('VS '+object['team_red_side']);
          kills_list.push(object['blue_side']['kills']);
          deaths_list.push(object['blue_side']['deaths']);
          assists_list.push(object['blue_side']['assists']);
          towers_list.push(object['blue_side']['towers']);
          inibitors_list.push(object['blue_side']['inibitors']);
          heralds_list.push(object['blue_side']['heralds']);
          dragons_list.push(object['blue_side']['dragons']);
          barons_list.push(object['blue_side']['barons']);
          golds_list.push(object['blue_side']['golds']);
          if (object['side_winner'] == 'blue') {
            wins++
          }
          else {
            loses++
          }
        }
        else if (object['team_red_side'] == team_name) {
          opponent_list.push('VS '+object['team_blue_side']);
          kills_list.push(object['red_side']['kills']);
          deaths_list.push(object['red_side']['deaths']);
          assists_list.push(object['red_side']['assists']);
          towers_list.push(object['red_side']['towers']);
          inibitors_list.push(object['red_side']['inibitors']);
          heralds_list.push(object['red_side']['heralds']);
          dragons_list.push(object['red_side']['dragons']);
          barons_list.push(object['red_side']['barons']);
          golds_list.push(object['red_side']['golds']);
          if (object['side_winner'] == 'red') {
            wins++
          }
          else {
            loses++
          }
        } 
      }
      
      // KDA total
      const games_sum = opponent_list.length;
      const kills_sum = kills_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      const deaths_sum = deaths_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      const assists_sum = assists_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      kda_sum = (kills_sum + assists_sum) / deaths_sum
      document.getElementById('kills-sum').innerHTML += kills_sum;
      document.getElementById('deaths-sum').innerHTML += deaths_sum;
      document.getElementById('assists-sum').innerHTML += assists_sum;
      document.getElementById('kda-sum').innerHTML += kda_sum.toFixed(2);
      // KDA average
      document.getElementById('kills-average').innerHTML += (kills_sum / games_sum).toFixed(2);
      document.getElementById('deaths-average').innerHTML += (deaths_sum / games_sum).toFixed(2);
      document.getElementById('assists-average').innerHTML += (assists_sum / games_sum).toFixed(2);
      document.getElementById('kda-average').innerHTML += (kda_sum / games_sum).toFixed(2);
      
      // Structures total
      const towers_sum = towers_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      const inibitors_sum = inibitors_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      document.getElementById('towers-sum').innerHTML += towers_sum;
      document.getElementById('inibitors-sum').innerHTML += inibitors_sum;
      // Structures average
      document.getElementById('towers-average').innerHTML += (towers_sum / games_sum).toFixed(2);
      document.getElementById('inibitors-average').innerHTML += (inibitors_sum / games_sum).toFixed(2);
      
      // Monsters total
      const heralds_sum = heralds_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      const dragons_sum = dragons_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      const barons_sum = barons_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      document.getElementById('heralds-sum').innerHTML += heralds_sum;
      document.getElementById('dragons-sum').innerHTML += dragons_sum;
      document.getElementById('barons-sum').innerHTML += barons_sum;
      // Monsters average
      document.getElementById('heralds-average').innerHTML += (heralds_sum / games_sum).toFixed(2);
      document.getElementById('dragons-average').innerHTML += (dragons_sum / games_sum).toFixed(2);
      document.getElementById('barons-average').innerHTML += (barons_sum / games_sum).toFixed(2);

      // Duration average
      console.log(duration_list)
      const duration_sum = addTimes(duration_list);
      duration_average = diviseTime(duration_sum, games_sum);
      document.getElementById('duration-average').innerHTML += duration_average;
      // Golds average
      const golds_sum = golds_list.reduce((accumulator, value) => {return accumulator + value;}, 0);
      document.getElementById('golds-average').innerHTML += (golds_sum / games_sum).toFixed(2);

      // Load charts
      chartKdaByGames(opponent_list, kills_list, deaths_list, assists_list);
      chartStructuresMonstersByGames(opponent_list, towers_list, inibitors_list, heralds_list, dragons_list, barons_list);
      chartGoldsByGames(opponent_list, golds_list)
      chartDurationByGames(opponent_list, duration_list)
    }
  };
}

loadGameStats()





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

// Divise
function diviseTime(time, division) {
  minutes = parseInt(time.split(':')[0]);
  seconds = parseInt(time.split(':')[1]);
  seconds = (seconds + minutes * 60) / division;
  minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return minutes+':'+seconds;
}

// Parse to int
function parseTime(time_list) {
  new_time_list = []
  for (time of time_list) {
    new_time_list.push(parseFloat(time.replace(':', '.')));
  }
  return new_time_list
}





// ----- CREATE CHARTS ----- //
// ------------------------- //

// KDA
function chartKdaByGames(opponent_list, kills_list, deaths_list, assists_list) {
  new Chart(document.getElementById("chart-kda").getContext('2d'), {
    type: 'bar',
    data: {
      labels: opponent_list,
      datasets: [
        {
          label: "Kills",
          data: kills_list,
          backgroundColor: ['#4ECCA3'],
        },
        {
          label: "Deaths",
          data: deaths_list,
          backgroundColor: ['#24B1A2'],
        },
        {
          label: "Assists",
          data: assists_list,
          backgroundColor: ['#0C969A'],
        }
      ]
    },
    options: {
      responsive: true,
    }
  });
}

// Duration
function chartDurationByGames(opponent_list, duration_list) {
  duration_list = parseTime(duration_list);
  new Chart(document.getElementById("chart-duration").getContext('2d'), {
    type: 'bar',
    data: {
      labels: opponent_list,
      datasets: [
        {
          label: "Durée",
          data: duration_list,
          backgroundColor: ['#24B1A2'],
        }
      ]
    },
    options: {
      responsive: true,
    }
  });
}

// Golds
function chartGoldsByGames(opponent_list, golds_list) {
  new Chart(document.getElementById("chart-golds").getContext('2d'), {
    type: 'bar',
    data: {
      labels: opponent_list,
      datasets: [
        {
          label: "Or",
          data: golds_list,
          backgroundColor: ['#24B1A2'],
        }
      ]
    },
    options: {
      responsive: true,
    }
  });
}

// Structures & monsters
function chartStructuresMonstersByGames(opponent_list, towers_list, inibitors_list, heralds_list, dragons_list, barons_list) {
  new Chart(document.getElementById("chart-structures-monsters").getContext('2d'), {
    type: 'bar',
    data: {
      labels: opponent_list,
      datasets: [
        {
          label: "Tourelles",
          data: towers_list,
          backgroundColor: ['#4ECCA3'],
        },    
        {
          label: "Inibiteurs",
          data: inibitors_list,
          backgroundColor: ['#24B1A2'],
        },
        {
          label: "Héralds",
          data: heralds_list,
          backgroundColor: ['#0C969A'],
        },
        {
          label: "Dragons",
          data: dragons_list,
          backgroundColor: ['#1C7B8A'],
        },
        {
          label: "Barons",
          data: barons_list,
          backgroundColor: ['#2A6173'],
        }
      ]
    },
    options: {
      responsive: true,
    }
  });
}
