from flask import Flask, Response, request, render_template, session, redirect, url_for
from mongodb.mongo_interactor import TeamsMongoAPI, UsersMongoAPI
from flask_cors import CORS
from dotenv import load_dotenv

import os
import json
import bcrypt


load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY")
CORS(app)

# -- LOGIN PAGES --
@app.route("/signup", methods=['post', 'get'])
def signup():
    mongoAPI = UsersMongoAPI()
    if "user_name" in session:
        return redirect(url_for("logged_in"))
    if request.method == "POST":
        user_name = request.form.get("user_name")        
        user_password1 = request.form.get("user_password1")
        user_password2 = request.form.get("user_password2")
        
        user_found = mongoAPI.read_one_user({"user_name": user_name})
        if user_found:
            return render_template('signup.html', message='[Erreur] Nom d\'utilisateur déjà utilisé !')
        if user_password1 != user_password2:
            return render_template('signup.html', message='[Erreur] Les mots de passes sont différents !')
        else:
            hashed = bcrypt.hashpw(user_password2.encode('utf-8'), bcrypt.gensalt())
            user_input = {'user_name': user_name, 'user_rank': 'Member', 'user_password': hashed}
            mongoAPI.write_user(user_input)
            user_data = mongoAPI.read_one_user({"user_name": user_name})
            new_user_name = user_data['user_name']
   
            return render_template('login.html', logged_in="Vous êtes connecté en tant que : "+new_user_name)
    return render_template('signup.html')

@app.route('/logged_in')
def logged_in():
    if "user_name" in session:
        user_name = session["user_name"]
        return render_template('login.html', logged_in="Vous êtes connecté en tant que : "+user_name)
    else:
        return redirect(url_for("login"))

@app.route("/login", methods=["POST", "GET"])
def login():
    if "user_name" in session:
        return redirect(url_for("logged_in"))

    if request.method == "POST":
        user_name = request.form.get("user_name")
        user_password = request.form.get("user_password")
        user_found = UsersMongoAPI().read_one_user({"user_name": user_name})
        
        if user_found:
            user_name_val = user_found['user_name']
            passwordcheck = user_found['user_password']
            
            if bcrypt.checkpw(user_password.encode('utf-8'), passwordcheck):
                session["user_name"] = user_name_val
                return redirect(url_for('logged_in'))
            else:
                if "user_name" in session:
                    return redirect(url_for("logged_in"))
                return render_template('login.html', message='[Erreur] Mot de passe incorect !')
        else:
            return render_template('login.html', message='[Erreur] Pseudo incorect !')
    return render_template('login.html')

@app.route("/logged_out")
def logged_out():
    if "user_name" in session:
        session.pop("user_name", None)
        return render_template('login.html', logged_out="Vous êtes déconnecté.")
    else:
        return render_template('login.html', logged_out="Vous n'êtes pas connecté.")



# -- HTML PAGES --
@app.route('/ranking')
def ranking():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('ranking.html', user_rank=user_rank)

@app.route('/teams_details')
def teams_details():
    user_rank = "Member"
    if "user_name" in session:
        print(session)
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('teams_details.html', user_rank=user_rank)

@app.route('/planning')
def planning():
    return render_template('planning.html')



# -- MONGODB ENDPOINTS --
# Get all or one team
@app.route('/teams', methods=['GET'])
def mongo_read():
    mongoAPI = TeamsMongoAPI()
    team_name = request.args.get('team_name')
    sort = request.args.get('sort')
    if team_name:
        response = mongoAPI.read_one({'team_name': team_name})
    elif sort:
        response = mongoAPI.read_alphabetics()
    else:
        response = mongoAPI.read()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Add one team
# Default value for all parameters except 'team_name' & 'team_league' required
@app.route('/teams', methods=['POST'])
def mongo_write():
    document = request.json
    document["team_tag"] = document["team_tag"] if document.get("team_tag") else "XXX"
    document["team_wins"] = document["team_wins"] if document.get("team_wins") else 0
    document["team_loses"] = document["team_loses"] if document.get("team_loses") else 0
    document["team_score"] = document["team_wins"] - document["team_loses"]
    document["team_captain"] = document["team_captain"] if document.get("team_captain") else "Non renseigné"
    document["team_description"] = document["team_description"] if document.get("team_description") else "Non renseigné"
    document["team_opgg"] = document["team_opgg"] if document.get("team_opgg") else "https://www.op.gg"
    document["team_members"] = document["team_members"] if document.get("team_members") else []
    document["team_members"].sort()
    if not document:
        return Response(response=json.dumps({"Error": "Please, provide the team information to add it."}),
                        status=400,
                        mimetype='application/json')
    response = TeamsMongoAPI().write(document)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update one team
@app.route('/teams', methods=['PUT'])
def mongo_update():
    team_name = request.args.get('team_name')
    document = request.json
    if document.get('team_members'):
        document['team_members'].sort()

    if not team_name or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and the name of the team to update."}),
                        status=400,
                        mimetype='application/json')
    response = TeamsMongoAPI().update({'team_name': team_name}, {'$set': document})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Delete one team
@app.route('/teams', methods=['DELETE'])
def mongo_delete():
    team_name = request.args.get('team_name')
    if not team_name:
        return Response(response=json.dumps({"Error": "Please, provide the name of the team to delete."}),
                        status=400,
                        mimetype='application/json')
    response = TeamsMongoAPI().delete({'team_name': team_name})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')



if __name__ == '__main__':
    # app.run(debug=True, port=5001, host='0.0.0.0') # Dev
    app.run()
