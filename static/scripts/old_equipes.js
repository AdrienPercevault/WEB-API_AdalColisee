function init() {
  logged = true
  if (logged) {
    document.getElementById('add-team-button').style.display="contents";
  }
}

init();

//
// LOAD
//
function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:5001/teams?sort=True");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML_gladiator = ''; 
      var trHTML_berserker = ''; 
      const objects = JSON.parse(this.responseText);
      logged = true
      for (let object of objects) {
        if (object['team_league'].toLowerCase() == 'gladiateur') {
          trHTML_gladiator += '<tr>'; 
          trHTML_gladiator += '<td>'+object['team_tag']+'</td>';
          trHTML_gladiator += '<td>'+object['team_name']+'</td>'; // TODO Empêcher les injections SQL
          if (logged) {
            trHTML_gladiator += '<td><button type="button" class="btn btn-outline-secondary" onclick="showTeamEditBox(\''+object['team_name']+'\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></button></td>';
            trHTML_gladiator += '<td><button type="button" class="btn btn-outline-danger" onclick="teamDelete(\''+object['team_name']+'\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button></td>';
          }
          // trHTML += '<td><img width="50px" src="'+object['avatar']+'" class="avatar"></td>';
          trHTML_gladiator += '</tr>';
        }
        else if (object['team_league'].toLowerCase() == "berserker") {
          trHTML_berserker += '<tr>'; 
          trHTML_berserker += '<td>'+object['team_tag']+'</td>';
          trHTML_berserker += '<td>'+object['team_name']+'</td>';
          if (logged) {
            trHTML_berserker += '<td><button type="button" class="btn btn-outline-secondary" onclick="showTeamEditBox(\''+object['team_name']+'\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></button></td>';
            trHTML_berserker += '<td><button type="button" class="btn btn-outline-danger" onclick="teamDelete(\''+object['team_name']+'\')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button></td>';
          }
          trHTML_berserker += "</tr>";
        }
      }
      document.getElementById('mytable-gladiator').innerHTML = trHTML_gladiator;
      document.getElementById('mytable-berserker').innerHTML = trHTML_berserker;
    }
  };
}

loadTable();

//
// ADD
//
function showTeamCreateBox() {
  Swal.fire({
    title: "Ajout d'une nouvelle équipe",
    html:
      '<input id="team_tag" class="swal2-input" placeholder="TAG" maxlength="3">' +
      '<input id="team_name" class="swal2-input" placeholder="Nom" maxlength="30">' + // TODO Empêcher les injections SQL
      '<select id="team_league" class="swal2-input"><option value="" selected disabled hidden>--Choisissez une ligue--</option><option value="gladiateur">Gladiateur</option><option value="berserker">Berserker</option></select>',
    focusConfirm: false,
    preConfirm: () => {
      if (document.getElementById('team_name').value && document.getElementById('team_league').value) {
        teamCreate();
      } else {
        Swal.showValidationMessage('Le nom et la ligue doivent être renseignés !')
      }
    }
  })
}

function teamCreate() {
  const team_tag = document.getElementById('team_tag').value.toUpperCase();
  const team_name = document.getElementById('team_name').value;
  const team_league = document.getElementById('team_league').value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:5001/teams");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "team_tag": team_tag,
    "team_name": team_name, // TODO Empêcher les injections SQL
    "team_league": team_league
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire("Team " + team_name + " ajouté avec succès !");
      loadTable();
    }
  };
}

// 
// EDIT
// 
function showTeamEditBox(team_name) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:5001/teams?team_name="+team_name);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      if (object["team_league"] == "berserker") {
        Swal.fire({
          title: "Modification d'équipe",
          html:
            '<input id="team_tag" class="swal2-input" placeholder="TAG" value="'+object['team_tag']+'">' +
            '<input id="team_name" class="swal2-input" placeholder="Nom" value="'+object['team_name']+'">' +
            '<select id="team_league" class="swal2-input"><option value="gladiateur">Gladiateur</option><option value="berserker" selected>Berserker</option></select>',
            focusConfirm: false,
          preConfirm: () => {
            teamEdit(team_name);
          }
        })
      }
      else {
        Swal.fire({
          title: "Modification d'équipe",
          html:
            '<input id="team_tag" class="swal2-input" placeholder="TAG" value="'+object['team_tag']+'">' +
            '<input id="team_name" class="swal2-input" placeholder="Nom" value="'+object['team_name']+'">' +
            '<select id="team_league" class="swal2-input"><option value="gladiateur">Gladiateur</option><option value="berserker">Berserker</option></select>',
            focusConfirm: false,
          preConfirm: () => {
            teamEdit(team_name);
          }
        })
      }
    }
  };
}

function teamEdit(default_team_name) {
  const team_tag = document.getElementById("team_tag").value;
  const team_name = document.getElementById("team_name").value;
  const team_league = document.getElementById("team_league").value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:5001/teams?team_name="+default_team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "team_tag": team_tag,
    "team_name": team_name,
    "team_league": team_league
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      Swal.fire("Team " + team_name + " modifié avec succès !");
      loadTable();
    }
  };
}

//
// DELETE
//
function teamDelete(team_name) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:5001/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "team_name": team_name
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire("Team " + team_name + " supprimé avec succès !");
      loadTable();
    } 
  };
}
