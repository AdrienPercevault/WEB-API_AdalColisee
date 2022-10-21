//
// LOAD TEAMS
//
function loadTeamsName() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/teams?sort=True");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var cardHTML = ''; 
      const objects = JSON.parse(this.responseText);
      cardHTML += `
        <li><a class="dropdown-item dropdown-list mt-2" href="/global_stats">Globales</a></li>
        <li><hr class="dropdown-divider"></li>
      `
      for (let object of objects) {
        team_name_printable = object['team_name'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        cardHTML += `<li><a class="dropdown-item dropdown-list mt-2" href="/teams_stats?team_name=`+object['team_name']+`">`+team_name_printable+`</a></li>`
      }
      document.getElementById('team-name-list').innerHTML = cardHTML;
    }
  };
}
loadTeamsName();
