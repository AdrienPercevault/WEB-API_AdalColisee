// Init button to add a team by making it visible only for admin user's.
function init_add_team_button() {
  let add_team_button = document.getElementById('add-team-button');
  if (user_rank == "Admin") {
    add_team_button.removeAttribute("hidden");
  }
}

init_add_team_button();

// -- TEAMS --
//
// LOAD TEAMS
//
function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/teams?sort=True");
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var cardHTML = ''; 
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        object['team_tag'] = object['team_tag'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        object['team_name'] = object['team_name'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        object['team_captain'] = object['team_captain'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        object['team_description'] = object['team_description'].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        team_name_no_space = object['team_name'].replace( /\s/g, '')

        cardHTML += `
        <div class="col p-4">
          <div class="card">
            <div class="card-body">
              <div class="col">
                <h3 class="card-title"><b>[`+object[`team_tag`]+`]</b> `+object[`team_name`]+`</h5>
                <p class="card-text mt-4">`+object[`team_description`]+`</p>
                <hr></hr>
                <p class="card-text"><b>Capitaine</b> : `+object[`team_captain`]+`</p>
                <p class="card-text"><b>Ligue</b> : `+object[`team_league`]+`</p>
                <p class="card-text"><b>Opgg</b> : <a href="`+object[`team_opgg`]+`">[Lien]</a></p>`
  
        if (object[`team_members`] !== 'undefined') {
          cardHTML += `
          <div class="card card-body d-flex justify-content-center mb-4">
            <button class="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapsedMembers`+team_name_no_space+`" aria-expanded="false" aria-controls="collapsedMembers`+team_name_no_space+`">Afficher la liste des membres</button>
            <div class="collapse multi-collapse" id="collapsedMembers`+team_name_no_space+`">
              <ul class="list-group list-group-flush">`

          for (index in object[`team_members`]) {
            cardHTML += `<li class="list list-group-item d-flex justify-content-center">`+object[`team_members`][index]
            if (user_rank == "Admin") {
              cardHTML += `<button type="button" class="btn-small bi-trash mx-3" onclick="removeMember(\``+object[`team_name`]+`\`, \``+index+`\`)"></button>`
            }
            cardHTML += `</li>`
          }

          if (user_rank == "Admin") {
            cardHTML += `
                <li class="list list-group-item d-flex justify-content-center">
                  <button type="button" class="btn-small btn-lg" onclick="showAddMemberBox(\``+object[`team_name`]+`\`)">Ajouter un membre</button>
                </li>`
          }
        }

        cardHTML += `
            </ul>
          </div>
        </div>
        `

        if (user_rank == "Admin") {
          cardHTML += `
          <div class="card-footer d-flex justify-content-center">
            <button type="button" class="btn bi-pencil-square mx-3" onclick="showTeamEditBox(\``+object[`team_name`]+`\`)"></button>
            <button type="button" class="btn bi-trash mx-3" onclick="teamDelete(\``+object[`team_name`]+`\`)"></button>
          </div>`
        }

        cardHTML += `
              </div>
            </div>
          </div>
        </div>`
      }
      document.getElementById('card-team').innerHTML = cardHTML;
    }
  };
}

loadTable();

//
// ADD TEAM
//
function showTeamCreateBox() {
  Swal.fire({
    title: "<h2 style='color:white'>Ajout d'une nouvelle équipe</h2>",
    background: "#323232",
    html: `
    <div class="mt-md-4 pb-5">
      <div class="form-outline form-white mb-4">
        <input id="team_tag" type="text" class="form-control form-control-lg" placeholder="TAG" maxlength="3"/>
      </div>
      <div class="form-outline form-white mb-4">
        <input id="team_name" type="text" class="form-control form-control-lg" placeholder="Nom" maxlength="30"/>
      </div>

      <div class="form-outline form-white mb-2">
        <input id="team_captain" type="text" class="form-control form-control-lg" placeholder="Capitaine"/>
      </div>

      <select id="team_league" class="swal2-input mb-4 league-select">
        <option value="" selected disabled hidden>--Choisissez une ligue--</option>
        <option value="gladiateur">Gladiateur</option>
        <option value="berserker">Berserker</option>
      </select>

      <div class="input-group mb-4">
        <span class="input-group-text">Description</span>
        <textarea id="team_description" class="form-control" aria-label="Description" rows="2"></textarea>
      </div>

      <div class="form-outline form-white">
        <input id="team_opgg" type="url" class="form-control form-control-lg" placeholder="https://www.op.gg" pattern="https://www.op.gg/multisearch/*"/>
      </div>
    </div>`,
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
  const team_captain = document.getElementById('team_captain').value;
  const team_description = document.getElementById('team_description').value;
  const team_opgg = document.getElementById('team_opgg').value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/teams");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "team_tag": team_tag,
    "team_name": team_name,
    "team_league": team_league,
    "team_captain": team_captain,
    "team_description": team_description,
    "team_opgg": team_opgg
  }));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire("Team " + team_name + " ajouté avec succès !");
      loadTable();
    }
  };
}

// 
// EDIT TEAM
// 
function showTeamEditBox(team_name) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/teams?team_name="+team_name);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      if (object["team_league"] == "berserker") {
        Swal.fire({
          title: "<h2 style='color:white'>Modification de l'équipe "+object["team_name"]+"</h2>",
          background: "#323232",
          html: `
          <div class="mt-md-4 pb-5">
            <div class="form-outline form-white mb-4">
              <input id="team_tag" type="text" class="form-control form-control-lg" placeholder="TAG" maxlength="3" value="`+object[`team_tag`]+`"/>
            </div>
            <div class="form-outline form-white mb-4">
              <input id="team_name" type="text" class="form-control form-control-lg" placeholder="Nom" maxlength="30" value="`+object[`team_name`]+`"/>
            </div>

            <div class="form-outline form-white mb-2">
              <input id="team_captain" type="text" class="form-control form-control-lg" placeholder="Capitaine" value="`+object[`team_captain`]+`"/>
            </div>

            <select id="team_league" class="swal2-input mb-4 league-select">
              <option value="" disabled hidden>--Choisissez une ligue--</option>
              <option value="gladiateur">Gladiateur</option>
              <option value="berserker" selected>Berserker</option>
            </select>

            <div class="input-group mb-4">
              <span class="input-group-text">Description</span>
              <textarea id="team_description" class="form-control" aria-label="Description" rows="2">`+object[`team_description`]+`</textarea>
            </div>

            <div class="form-outline form-white">
              <input id="team_opgg" type="url" class="form-control form-control-lg" placeholder="https://www.op.gg" pattern="https://www.op.gg/multisearch/*" value="`+object[`team_opgg`]+`"/>
            </div>
          </div>`,
          focusConfirm: false,
          preConfirm: () => {
            if (document.getElementById('team_name').value && document.getElementById('team_league').value) {
              teamEdit(team_name);
            } else {
              Swal.showValidationMessage('Le nom et la ligue doivent être renseignés !')
            }
          }
        })
      }
      else {
        Swal.fire({
          title: "<h2 style='color:white'>Modification de l'équipe "+object["team_name"]+"</h2>",
          background: "#323232",
          html: `
          <div class="mt-md-4 pb-5">
            <div class="form-outline form-white mb-4">
              <input id="team_tag" type="text" class="form-control form-control-lg" placeholder="TAG" maxlength="3" value="`+object[`team_tag`]+`"/>
            </div>
            <div class="form-outline form-white mb-4">
              <input id="team_name" type="text" class="form-control form-control-lg" placeholder="Nom" maxlength="30" value="`+object[`team_name`]+`"/>
            </div>

            <div class="form-outline form-white mb-2">
              <input id="team_captain" type="text" class="form-control form-control-lg" placeholder="Capitaine" value="`+object[`team_captain`]+`"/>
            </div>

            <select id="team_league" class="swal2-input mb-4 league-select">
              <option value="" disabled hidden>--Choisissez une ligue--</option>
              <option value="gladiateur">Gladiateur</option>
              <option value="berserker">Berserker</option>
            </select>

            <div class="input-group mb-4">
              <span class="input-group-text">Description</span>
              <textarea id="team_description" class="form-control" aria-label="Description" rows="2">`+object[`team_description`]+`</textarea>
            </div>

            <div class="form-outline form-white mb-4">
              <input id="team_opgg" type="url" class="form-control form-control-lg" placeholder="https://www.op.gg" pattern="https://www.op.gg/multisearch/*" value="`+object[`team_opgg`]+`"/>
            </div>
          </div>`,
          focusConfirm: false,
          preConfirm: () => {
            if (document.getElementById('team_name').value && document.getElementById('team_league').value) {
              teamEdit(team_name);
            } else {
              Swal.showValidationMessage('Le nom et la ligue doivent être renseignés !')
            }
          }
        })
      }
    }
  };
}

function teamEdit(default_team_name) {
  const team_tag = document.getElementById('team_tag').value.toUpperCase();
  const team_name = document.getElementById('team_name').value;
  const team_league = document.getElementById('team_league').value;
  const team_captain = document.getElementById('team_captain').value;
  const team_description = document.getElementById('team_description').value;
  const team_opgg = document.getElementById('team_opgg').value;
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+default_team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "team_tag": team_tag,
    "team_name": team_name,
    "team_league": team_league,
    "team_captain": team_captain,
    "team_description": team_description,
    "team_opgg": team_opgg
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
  xhttp.open("DELETE", "/teams?team_name="+team_name);
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




// -- TEAM MEMBERS --
//
// ADD MEMBER
//
function showAddMemberBox(team_name) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/teams?team_name="+team_name);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      Swal.fire({
        title: "<h2 style='color:white'>Ajout d'un membre pour "+object["team_name"]+"</h2>",
        background: "#323232",
        html: `
        <div class="mt-md-4 pb-5">
          <div class="form-outline form-white mb-2">
            <input id="team_member" type="text" class="form-control form-control-lg" placeholder="Membre"/>
          </div>
        </div>`,
        focusConfirm: false,
        preConfirm: () => {
          if (document.getElementById('team_member').value) {
            addMember(team_name, object["team_members"])
          } else {
            Swal.showValidationMessage('Le nom membre doit être renseignés !')
          }
        }
      })
    }
  };
}

function addMember(team_name, team_members) {
  const team_member = document.getElementById('team_member').value;
  console.log(typeof(team_members))
  team_members.push(team_member)
    
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/teams?team_name="+team_name);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "team_members": team_members
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
// REMOVE MEMBER
//
function removeMember(team_name, index) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/teams?team_name="+team_name);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText);
      team_members = object["team_members"]
      team_members.splice(index, 1)

      xhttp.open("PUT", "/teams?team_name="+team_name);
      xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhttp.send(JSON.stringify({ 
        "team_members": team_members
      }));
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const object = JSON.parse(this.responseText);
          Swal.fire("Team " + team_name + " modifié avec succès !");
          loadTable();
        }
      };
    }
  };
}
