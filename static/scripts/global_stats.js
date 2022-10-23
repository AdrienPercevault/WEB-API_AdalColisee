// ----- LOAD STATS ----- //
// ---------------------- //

// Load stats
function loadStats() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/stats?season=S3");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      const teams_list = Object.keys(object);
      teams_list.shift();
      kda_dict = {};
      kills_dict = {}, kills_list = [];
      deaths_dict = {}, deaths_list = [];
      assists_dict = {}, assists_list = [];

      kda_dict_average = {};
      kills_dict_average = {}, kills_list_average = [];
      deaths_dict_average = {}, deaths_list_average = [];
      assists_dict_average = {}, assists_list_average = [];
      duration_dict_average = {}, duration_list_average = [];
      golds_dict_average = {}, golds_list_average = [];
      towers_dict_average = {}, towers_list_average = [];
      inibitors_dict_average = {}, inibitors_list_average = [];
      heralds_dict_average = {}, heralds_list_average = [];
      dragons_dict_average = {}, dragons_list_average = [];
      barons_dict_average = {}, barons_list_average = [];

      for (team_name of teams_list) {
        // TOTAL
        // kda
        kda = (object[team_name]['kills'] + object[team_name]['assists']) / object[team_name]['deaths'];
        kda_dict[team_name] = kda;
        // kills
        kills_dict[team_name] = object[team_name]['kills'];
        kills_list.push(object[team_name]['kills']);
        // deaths
        deaths_dict[team_name] = object[team_name]['deaths'];
        deaths_list.push(object[team_name]['deaths']);
        // Assists
        assists_dict[team_name] = object[team_name]['assists'];
        assists_list.push(object[team_name]['assists']);

        // AVERAGE
        games_sum = object[team_name]['wins'] + object[team_name]['loses']
        if (games_sum !== 0) {
          // kda
          kda_dict_average[team_name] = kda / games_sum;
          // kills
          kills_dict_average[team_name] = object[team_name]['kills'] / games_sum;
          kills_list_average.push(object[team_name]['kills'] / games_sum);
          // deaths
          deaths_dict_average[team_name] = object[team_name]['deaths'] / games_sum;
          deaths_list_average.push(object[team_name]['deaths'] / games_sum);
          // Assists
          assists_dict_average[team_name] = object[team_name]['assists'] / games_sum;
          assists_list_average.push(object[team_name]['assists'] / games_sum);
          // Duration
          average_duration = parseTime([diviseTime(object[team_name]['game_duration'], games_sum)])
          duration_dict_average[team_name] = average_duration;
          duration_list_average.push(average_duration);
          // Golds
          golds_dict_average[team_name] = object[team_name]['golds'] / games_sum;
          golds_list_average.push(object[team_name]['golds'] / games_sum);
          // Towers
          towers_dict_average[team_name] = object[team_name]['towers'] / games_sum;
          towers_list_average.push(object[team_name]['towers'] / games_sum);
          // Inibitors
          inibitors_dict_average[team_name] = object[team_name]['inibitors'] / games_sum;
          inibitors_list_average.push(object[team_name]['inibitors'] / games_sum);
          // Heralds
          heralds_dict_average[team_name] = object[team_name]['heralds'] / games_sum;
          heralds_list_average.push(object[team_name]['heralds'] / games_sum);
          // Dragons
          dragons_dict_average[team_name] = object[team_name]['dragons'] / games_sum;
          dragons_list_average.push(object[team_name]['dragons'] / games_sum);
          // Barons
          barons_dict_average[team_name] = object[team_name]['barons'] / games_sum;
          barons_list_average.push(object[team_name]['barons'] / games_sum);
          
        }
      }

      // TOTAL
      // Best kda
      best_kda = getBestTeamAndScoreFromDict(kda_dict);
      document.getElementById('best-kda-team').innerHTML += best_kda[0];
      document.getElementById('best-kda').innerHTML += parseInt(best_kda[1]).toFixed(2);
      // Best kills
      best_kills = getBestTeamAndScoreFromDict(kills_dict);
      document.getElementById('best-kills-team').innerHTML += best_kills[0];
      document.getElementById('best-kills').innerHTML += parseInt(best_kills[1]).toFixed(2);
      // Best deaths
      best_deaths = getBestTeamAndScoreFromDict(deaths_dict);
      document.getElementById('best-deaths-team').innerHTML += best_deaths[0];
      document.getElementById('best-deaths').innerHTML += parseInt(best_deaths[1]).toFixed(2);
      // Best assists
      best_assists = getBestTeamAndScoreFromDict(assists_dict);
      document.getElementById('best-assists-team').innerHTML += best_assists[0];
      document.getElementById('best-assists').innerHTML += parseInt(best_assists[1]).toFixed(2);
      // Pie chart
      pieChartOptionsByTeam("chart-kills", "Total kills", teams_list, kills_list);
      pieChartOptionsByTeam("chart-deaths", "Total deaths", teams_list, deaths_list);
      pieChartOptionsByTeam("chart-assists", "Total assists", teams_list, assists_list);

      // AVERAGE
      // Best kda
      best_kda_average = getBestTeamAndScoreFromDict(kda_dict_average);
      document.getElementById('best-kda-team-average').innerHTML += best_kda_average[0];
      document.getElementById('best-kda-average').innerHTML += parseInt(best_kda_average[1]).toFixed(2);
      // Best kills
      best_kills_average = getBestTeamAndScoreFromDict(kills_dict_average);
      document.getElementById('best-kills-team-average').innerHTML += best_kills_average[0];
      document.getElementById('best-kills-average').innerHTML += parseInt(best_kills_average[1]).toFixed(2);
      // Best deaths
      best_deaths_average = getBestTeamAndScoreFromDict(deaths_dict_average);
      document.getElementById('best-deaths-team-average').innerHTML += best_deaths_average[0];
      document.getElementById('best-deaths-average').innerHTML += parseInt(best_deaths_average[1]).toFixed(2);
      // Best assists
      best_assists_average = getBestTeamAndScoreFromDict(assists_dict_average);
      document.getElementById('best-assists-team-average').innerHTML += best_assists_average[0];
      document.getElementById('best-assists-average').innerHTML += parseInt(best_assists_average[1]).toFixed(2);
      // Best duration
      best_duration_average = getBestTeamAndScoreFromDict(duration_dict_average);
      document.getElementById('best-duration-team-average').innerHTML += best_duration_average[0];
      document.getElementById('best-duration-average').innerHTML += best_duration_average[1];
      // Best golds
      best_golds_average = getBestTeamAndScoreFromDict(golds_dict_average);
      document.getElementById('best-golds-team-average').innerHTML += best_golds_average[0];
      document.getElementById('best-golds-average').innerHTML += parseInt(best_golds_average[1]).toFixed(2);
      // Best towers
      best_towers_average = getBestTeamAndScoreFromDict(towers_dict_average);
      document.getElementById('best-towers-team-average').innerHTML += best_towers_average[0];
      document.getElementById('best-towers-average').innerHTML += parseInt(best_towers_average[1]).toFixed(2);
      // Best inibitors
      best_inibitors_average = getBestTeamAndScoreFromDict(inibitors_dict_average);
      document.getElementById('best-inibitors-team-average').innerHTML += best_inibitors_average[0];
      document.getElementById('best-inibitors-average').innerHTML += parseInt(best_inibitors_average[1]).toFixed(2);
      // Best heralds
      best_heralds_average = getBestTeamAndScoreFromDict(heralds_dict_average);
      document.getElementById('best-heralds-team-average').innerHTML += best_heralds_average[0];
      document.getElementById('best-heralds-average').innerHTML += parseInt(best_heralds_average[1]).toFixed(2);
      // Best dragons
      best_dragons_average = getBestTeamAndScoreFromDict(dragons_dict_average);
      document.getElementById('best-dragons-team-average').innerHTML += best_dragons_average[0];
      document.getElementById('best-dragons-average').innerHTML += parseInt(best_dragons_average[1]).toFixed(2);
      // Best barons
      best_barons_average = getBestTeamAndScoreFromDict(barons_dict_average);
      document.getElementById('best-barons-team-average').innerHTML += best_barons_average[0];
      document.getElementById('best-barons-average').innerHTML += parseInt(best_barons_average[1]).toFixed(2);

      // Pie chart
      pieChartOptionsByTeam("chart-kills-average", "Kills moyen", teams_list, kills_list_average);
      pieChartOptionsByTeam("chart-deaths-average", "Deaths moyenne", teams_list, deaths_list_average);
      pieChartOptionsByTeam("chart-assists-average", "Assists moyenne", teams_list, assists_list_average);
      pieChartOptionsByTeam("chart-duration-average", "Durée moyenne", teams_list, duration_list_average);
      pieChartOptionsByTeam("chart-golds-average", "Or moyen", teams_list, golds_list_average);
      pieChartOptionsByTeam("chart-towers-average", "Or moyen", teams_list, towers_list_average);
      pieChartOptionsByTeam("chart-inibitors-average", "Or moyen", teams_list, inibitors_list_average);
      pieChartOptionsByTeam("chart-heralds-average", "Or moyen", teams_list, heralds_list_average);
      pieChartOptionsByTeam("chart-dragons-average", "Or moyen", teams_list, dragons_list_average);
      pieChartOptionsByTeam("chart-barons-average", "Or moyen", teams_list, barons_list_average);

      // Radar chart
      radarChartKDAByTeam("chart-kda-average", teams_list, kills_list_average, deaths_list_average, assists_list_average);
      radarChartStructuresMonstersByTeam("chart-structures-monsters-average", teams_list, towers_list_average, inibitors_list_average, heralds_list_average, dragons_list_average, barons_list_average);
    }
  };
}

loadStats()





// ----- OPERATIONS ----- //
// ---------------------- //

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
  new_time_list = [];
  for (time of time_list) {
    new_time_list.push(parseFloat(time.replace(':', '.')));
  }
  return new_time_list;
}

// Team and score from dict
function getBestTeamAndScoreFromDict(dict) {
  best_value = 0;
  best_team = "";
  for (const [key, value] of Object.entries(dict)) {
    if (value > best_value) {
      best_team = key;
      best_value = value;
    }
  }
  return [best_team, best_value];
}






// ----- CREATE CHARTS ----- //
// ------------------------- //

// Pie chart options by team
function pieChartOptionsByTeam(chart_id, label, teams_list, option_list) {
  new Chart(document.getElementById(chart_id), {
    type: 'pie',
    data: {
      labels: teams_list,
      datasets: [{
        label: label,
        backgroundColor: ["#1294A7", "#4ECCA3", "#4CC1FF", "#619C86", "#24B1A2", "#0C969A", "#1C7B8A", "#2A6173", "#0092CF", "#0079CF"],
        data: option_list
      }]
    },
    options: {
      responsive: true,
    }
  });
}

// Radar chart options by team
function radarChartKDAByTeam(chart_id, teams_list, kills_list, deaths_list, assists_list) {
  new Chart(document.getElementById(chart_id), {
    type: 'radar',
    data: {
      labels: teams_list,
      datasets: [
        {
          label: 'Kills',
          data: kills_list,
          fill: true,
          backgroundColor: 'rgba(78, 204, 163, 0.2)',
          borderColor: 'rgb(78, 204, 163)',
          pointBackgroundColor: 'rgb(78, 204, 163)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(78, 204, 163)'
        },
        {
          label: 'Morts',
          data: deaths_list,
          fill: true,
          backgroundColor: 'rgba(36, 177, 162, 0.2)',
          borderColor: 'rgb(36, 177, 162)',
          pointBackgroundColor: 'rgb(36, 177, 162)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(36, 177, 162)'
        },
        {
          label: 'Assists',
          data: assists_list,
          fill: true,
          backgroundColor: 'rgba(12, 150, 154, 0.2)',
          borderColor: 'rgb(12, 150, 154)',
          pointBackgroundColor: 'rgb(12, 150, 154)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(12, 150, 154)'
        },
      ]
    },
    options: {
      responsive: true,
    }
  });
}

function radarChartStructuresMonstersByTeam(chart_id, teams_list, towers_list, inibitors_list, heralds_list, dragons_list, barons_list) {
  new Chart(document.getElementById(chart_id), {
    type: 'radar',
    data: {
      labels: teams_list,
      datasets: [
        {
          label: 'Tourelles',
          data: towers_list,
          fill: true,
          backgroundColor: 'rgba(78, 204, 163, 0.2)',
          borderColor: 'rgb(78, 204, 163)',
          pointBackgroundColor: 'rgb(78, 204, 163)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(78, 204, 163)'
        },
        {
          label: 'Inibiteurs',
          data: inibitors_list,
          fill: true,
          backgroundColor: 'rgba(36, 177, 162, 0.2)',
          borderColor: 'rgba(36, 177, 162)',
          pointBackgroundColor: 'rgb(36, 177, 162)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(36, 177, 162)'
        },
        {
          label: 'Héralds',
          data: heralds_list,
          fill: true,
          backgroundColor: 'rgba(12, 150, 154, 0.2)',
          borderColor: 'rgb(12, 150, 154)',
          pointBackgroundColor: 'rgb(12, 150, 154)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(12, 150, 154)'
        },
        {
          label: 'Dragons',
          data: dragons_list,
          fill: true,
          backgroundColor: 'rgba(28, 123, 138, 0.2)',
          borderColor: 'rgb(28, 123, 138)',
          pointBackgroundColor: 'rgb(28, 123, 138)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(28, 123, 138)'
        },
        {
          label: 'Barons',
          data: barons_list,
          fill: true,
          backgroundColor: 'rgba(42, 97, 115, 0.2)',
          borderColor: 'rgb(42, 97, 115)',
          pointBackgroundColor: 'rgb(42, 97, 115)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(42, 97, 115)'
        },
      ]
    },
    options: {
      responsive: true,
    }
  });
}
