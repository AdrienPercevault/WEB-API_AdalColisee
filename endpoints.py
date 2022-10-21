from flask import Flask, Response, request, render_template, session, redirect, url_for
from interactor.mongo_interactor import TeamsMongoAPI, UsersMongoAPI, GamesMongoAPI, SchedulesMongoAPI, StatsMongoAPI
from flask_cors import CORS
from dotenv import load_dotenv

import os
import json
import bcrypt


load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY")
CORS(app)





# ----- HTML PAGES ----- #
# ---------------------- #

# Default page redirect
@app.route('/')
def index():
    return redirect(url_for("ranking"))

# Ranking page
@app.route('/ranking')
def ranking():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('ranking.html', user_rank=user_rank)

# Details of all the teams page
@app.route('/teams_details')
def teams_details():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('teams_details.html', user_rank=user_rank)

# Planning page
@app.route('/planning')
def planning():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('planning.html', user_rank=user_rank)

# Details of one specific team page
@app.route('/teams_stats')
def teams_stats():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('teams_stats.html', user_rank=user_rank)

# Form to add a new game for a match
@app.route('/add_game')
def add_game():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('add_game.html', user_rank=user_rank)

# Form to add a new game for a match
@app.route('/global_stats')
def globales_stats():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('global_stats.html', user_rank=user_rank)





# ----- LOGIN PAGES ----- #
# ----------------------- #

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





# ----- TEAMS ENDPOINTS ----- #
# --------------------------- #

# Get all or one team
@app.route('/teams', methods=['GET'])
def mongo_read_teams():
    mongoAPI = TeamsMongoAPI()
    team_name = request.args.get('team_name')
    sort = request.args.get('sort')
    if team_name:
        response = mongoAPI.read_one_team({'team_name': team_name})
    elif sort:
        response = mongoAPI.read_teams_alphabetics()
    else:
        response = mongoAPI.read_teams()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Add one team
# Default value for all parameters except 'team_name' & 'team_league' required
@app.route('/teams', methods=['POST'])
def mongo_write_team():
    document = request.json
    document["team_tag"] = document["team_tag"] if document.get("team_tag") else "XXX"
    document["team_wins"] = document["team_wins"] if document.get("team_wins") else 0
    document["team_loses"] = document["team_loses"] if document.get("team_loses") else 0
    document["team_score"] = document["team_wins"] - document["team_loses"]
    document["team_captain"] = document["team_captain"] if document.get("team_captain") else "Non renseigné"
    document["team_coach"] = document["team_coach"] if document.get("team_coach") else "Non renseigné"
    document["team_description"] = document["team_description"] if document.get("team_description") else "Non renseigné"
    document["team_opgg"] = document["team_opgg"] if document.get("team_opgg") else "https://www.op.gg"
    document["team_members"] = document["team_members"] if document.get("team_members") else []
    document["team_members"].sort()
    if not document:
        return Response(response=json.dumps({"Error": "Please, provide the team information to add it."}),
                        status=400,
                        mimetype='application/json')
    response = TeamsMongoAPI().write_team(document)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update one team
@app.route('/teams', methods=['PUT'])
def mongo_update_team():
    team_name = request.args.get('team_name')
    document = request.json
    if document.get('team_members'):
        document['team_members'].sort()

    if not team_name or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and the name of the team to update."}),
                        status=400,
                        mimetype='application/json')
    response = TeamsMongoAPI().update_team({'team_name': team_name}, {'$set': document})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Delete one team
@app.route('/teams', methods=['DELETE'])
def mongo_delete_team():
    team_name = request.args.get('team_name')
    if not team_name:
        return Response(response=json.dumps({"Error": "Please, provide the name of the team to delete."}),
                        status=400,
                        mimetype='application/json')
    response = TeamsMongoAPI().delete_team({'team_name': team_name})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')





# ----- GAMES ENDPOINTS ----- #
# --------------------------- #

# Get all or one game
@app.route('/games', methods=['GET'])
def mongo_read_games():
    mongoAPI = GamesMongoAPI()
    game_id = request.args.get('game_id')
    team_name = request.args.get('team_name')
    if game_id:
        response = mongoAPI.read_one_game({'game_id': game_id})
    elif team_name:
        response = mongoAPI.read_games_by_name(team_name)
    else:
        response = mongoAPI.read_games()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Add one game
@app.route('/games', methods=['POST'])
def mongo_write_game():
    document = request.json
    if not document:
        return Response(response=json.dumps({"Error": "Please, provide the game information to add it."}),
                        status=400,
                        mimetype='application/json')
    response = GamesMongoAPI().write_game(document)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update one game
@app.route('/games', methods=['PUT'])
def mongo_update_game():
    game_id = request.args.get('game_id')
    document = request.json
    if not game_id or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and the game id to update."}),
                        status=400,
                        mimetype='application/json')
    response = GamesMongoAPI().update_game({'game_id': game_id}, {'$set': document})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Delete one game
@app.route('/games', methods=['DELETE'])
def mongo_delete_game():
    game_id = request.args.get('game_id')
    if not game_id:
        return Response(response=json.dumps({"Error": "Please, provide the game id to delete."}),
                        status=400,
                        mimetype='application/json')
    response = GamesMongoAPI().delete_game({'game_id': game_id})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')





# ----- SCHEDULE ENDPOINTS ----- #
# ------------------------------ #

# Get all or one schedule
@app.route('/schedules', methods=['GET'])
def mongo_read_schedules():
    mongoAPI = SchedulesMongoAPI()
    phase = request.args.get('phase')
    if phase:
        response = mongoAPI.read_one_schedule({'phase': phase})
    else:
        response = mongoAPI.read_schedules()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Add one schedule
@app.route('/schedules', methods=['POST'])
def mongo_write_schedule():
    document = request.json
    if not document:
        return Response(response=json.dumps({"Error": "Please, provide the schedule information to add it."}),
                        status=400,
                        mimetype='application/json')
    response = SchedulesMongoAPI().write_schedule(document)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update one schedule
@app.route('/schedules', methods=['PUT'])
def mongo_update_schedule():
    phase = request.args.get('phase')
    document = request.json
    if not phase or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and phase to update the schedule for this phase."}),
                        status=400,
                        mimetype='application/json')
    response = SchedulesMongoAPI().update_schedule({'phase': phase}, {'$set': document})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Delete one schedule
@app.route('/schedules', methods=['DELETE'])
def mongo_delete_schedule():
    phase = request.args.get('phase')
    if not phase:
        return Response(response=json.dumps({"Error": "Please, provide the phase to delete the schedule for this phase."}),
                        status=400,
                        mimetype='application/json')
    response = SchedulesMongoAPI().delete_schedule({'phase': phase})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')





# ----- STATS ENDPOINTS ----- #
# --------------------------- #

# Get all or one stat
@app.route('/stats', methods=['GET'])
def mongo_read_stats():
    mongoAPI = StatsMongoAPI()
    season = request.args.get('season')
    if season:
        response = mongoAPI.read_one_stat({'season': season})
    else:
        response = mongoAPI.read_stats()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Add one stat
@app.route('/stats', methods=['POST'])
def mongo_write_stat():
    document = request.json
    if not document:
        return Response(response=json.dumps({"Error": "Please, provide the stats information to add it."}),
                        status=400,
                        mimetype='application/json')
    response = StatsMongoAPI().write_stat(document)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update one game
@app.route('/stats', methods=['PUT'])
def mongo_update_stat():
    season = request.args.get('season')
    document = request.json
    if not season or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and the stat id to update."}),
                        status=400,
                        mimetype='application/json')
    response = StatsMongoAPI().update_stat({'season': season}, {'$set': document})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')





# ----- LAUNCH APP ----- #
# ---------------------- #

if __name__ == '__main__':
    # app.run(debug=True, port=5001, host='0.0.0.0') # Dev
    app.run()
