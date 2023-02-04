from flask import Flask, Response, request, render_template, session, redirect, url_for, send_file
from interactor.mongo_interactor import TeamsMongoAPI, UsersMongoAPI, GamesMongoAPI, SchedulesMongoAPI, StatsMongoAPI, MatchesMongoAPI
from flask_cors import CORS
from dotenv import load_dotenv

import os
import json
import bcrypt
import hashlib


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

# Settlement page
@app.route('/settlement')
def settlement():
    return render_template('settlement.html')

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
    return render_template('planning_matches.html', user_rank=user_rank)

# Planning playoff page
@app.route('/planning_playoff')
def planning_playoff():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('planning_playoff.html', user_rank=user_rank)

# Details of one specific team page
@app.route('/teams_stats')
def teams_stats():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('teams_stats.html', user_rank=user_rank)

# Form to add a new game for a match
@app.route('/game_details')
def game_details():
    user_rank = "Member"
    if "user_name" in session:
        user_data = UsersMongoAPI().read_one_user({"user_name": session.get('user_name')})
        user_rank = user_data.get('user_rank')
    return render_template('game_details.html', user_rank=user_rank)

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





# # ----- GAMES ENDPOINTS ----- #
# # --------------------------- #

# # Get all or one game
# @app.route('/games', methods=['GET'])
# def mongo_read_games():
#     mongoAPI = GamesMongoAPI()
#     game_id = request.args.get('game_id')
#     team_name = request.args.get('team_name')
#     if game_id:
#         response = mongoAPI.read_one_game({'game_id': game_id})
#     elif team_name:
#         response = mongoAPI.read_games_by_name(team_name)
#     else:
#         response = mongoAPI.read_games()
#     return Response(response=json.dumps(response),
#                     status=200,
#                     mimetype='application/json')

# # Add one game
# @app.route('/games', methods=['POST'])
# def mongo_write_game():
#     document = request.json
#     if not document:
#         return Response(response=json.dumps({"Error": "Please, provide the game information to add it."}),
#                         status=400,
#                         mimetype='application/json')
#     response = GamesMongoAPI().write_game(document)
#     return Response(response=json.dumps(response),
#                     status=200,
#                     mimetype='application/json')

# # Update one game
# @app.route('/games', methods=['PUT'])
# def mongo_update_game():
#     game_id = request.args.get('game_id')
#     document = request.json
#     if not game_id or not document:
#         return Response(response=json.dumps({"Error": "Please, provide the changes and the game id to update."}),
#                         status=400,
#                         mimetype='application/json')
#     response = GamesMongoAPI().update_game({'game_id': game_id}, {'$set': document})
#     return Response(response=json.dumps(response),
#                     status=200,
#                     mimetype='application/json')

# # Delete one game
# @app.route('/games', methods=['DELETE'])
# def mongo_delete_game():
#     game_id = request.args.get('game_id')
#     if not game_id:
#         return Response(response=json.dumps({"Error": "Please, provide the game id to delete."}),
#                         status=400,
#                         mimetype='application/json')
#     response = GamesMongoAPI().delete_game({'game_id': game_id})
#     return Response(response=json.dumps(response),
#                     status=200,
#                     mimetype='application/json')





# ----- SCHEDULE PLANNING ENDPOINTS ----- #
# --------------------------------------- #

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





# ----- MATCHES ENDPOINTS ----- #
# ------------------------------ #

# Get all or one match
@app.route('/matches', methods=['GET'])
def mongo_read_match():
    mongoAPI = MatchesMongoAPI()
    match_id = request.args.get('match_id')
    if match_id:
        response = mongoAPI.read_one_match({'match_id': match_id})
    else:
        response = mongoAPI.read_matches()
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Add one match
@app.route('/matches', methods=['POST'])
def mongo_write_match():
    document = request.json
    document["match_date"] = document["match_date"] if document.get("match_date") else "0000-00-00"
    document["match_hours"] = document["match_hours"] if document.get("match_hours") else "00-00"
    document["match_score"] = document["match_score"] if document.get("match_score") else "0-0"
    document["match_bo"] = document["match_bo"] if document.get("match_bo") else "BO1"
    document["match_id"] = hashlib.sha1(str.encode(document["match_date"]+document["match_hours"]+document["match_team1"]+document["match_team2"])).hexdigest()
    if not document:
        return Response(response=json.dumps({"Error": "Please, provide the match information to add it."}),
                        status=400,
                        mimetype='application/json')
    response = MatchesMongoAPI().write_match(document)
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update one match
@app.route('/matches', methods=['PUT'])
def mongo_update_match():
    match_id = request.args.get('match_id')
    document = request.json
    if not match_id or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and match_id to update the match for this match_id."}),
                        status=400,
                        mimetype='application/json')
    response = MatchesMongoAPI().update_match({'match_id': match_id}, {'$set': document})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Update match_games to add or update one game
@app.route('/games', methods=['PUT'])
def mongo_update_game():
    match_id = request.args.get('match_id')
    game_id = request.args.get('game_id')
    index = request.args.get('index')
    document = request.json
    if not match_id or not document:
        return Response(response=json.dumps({"Error": "Please, provide the changes and match_id to update the match for this match_id."}),
                        status=400,
                        mimetype='application/json')
    if game_id and index:
        # response = MatchesMongoAPI().update_match({'match_id': match_id}, {'$pull': {'match_games.'+index : document}})
        response = MatchesMongoAPI().update_match({'match_id': match_id}, {'$pull': {'match_games' : document }})

    if index:
        response = MatchesMongoAPI().update_match({'match_id': match_id}, {'$set': {'match_games.'+index : document}})
    else:
        response = MatchesMongoAPI().update_match({'match_id': match_id}, {'$push': {'match_games' : document}})
    return Response(response=json.dumps(response),
                    status=200,
                    mimetype='application/json')

# Delete one match
@app.route('/matches', methods=['DELETE'])
def mongo_delete_match():
    match_id = request.args.get('match_id')
    if not match_id:
        return Response(response=json.dumps({"Error": "Please, provide the match_id to delete the match for this match_id."}),
                        status=400,
                        mimetype='application/json')
    response = MatchesMongoAPI().delete_match({'match_id': match_id})
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





# ----- Team Logos ----- #
# ---------------------- #

# To change and add image in the database but need to change DB.
@app.route('/AcadémieFruitière')
def academieLogo():
    if not os.path.exists('./static/logos/AcadémieFruitière.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/AcadémieFruitière.png', mimetype='image')

@app.route('/Astral')
def astralLogo():
    if not os.path.exists('./static/logos/Astral.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/Astral.png', mimetype='image')

@app.route('/BannedSeagull')
def bannedLogo():
    if not os.path.exists('./static/logos/BannedSeagull.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/BannedSeagull.png', mimetype='image')

@app.route('/Initium')
def initiumLogo():
    if not os.path.exists('./static/logos/Initium.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/Initium.png', mimetype='image')

@app.route('/MonarchieFruitière')
def monarchieLogo():
    if not os.path.exists('./static/logos/MonarchieFruitière.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/MonarchieFruitière.png', mimetype='image')

@app.route('/Morues')
def moruesLogo():
    if not os.path.exists('./static/logos/Morues.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/Morues.png', mimetype='image')

@app.route('/PolicedeMarseille')
def policeLogo():
    if not os.path.exists('./static/logos/PolicedeMarseille.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/PolicedeMarseille.png', mimetype='image')

@app.route('/Shteamles')
def shLogo():
    if not os.path.exists('./static/logos/Shteamles.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/Shteamles.png', mimetype='image')

@app.route('/SpicyGaming')
def spicyLogo():
    if not os.path.exists('./static/logos/SpicyGaming.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/SpicyGaming.png', mimetype='image')

@app.route('/Zerotankiness')
def zeroLogo():
    if not os.path.exists('./static/logos/Zerotankiness.png'):
        return send_file('./static/logos/BeeMad.png', mimetype='image')
    return send_file('./static/logos/Zerotankiness.png', mimetype='image')





# ----- LAUNCH APP ----- #
# ---------------------- #

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0') # Dev
    # app.run()
