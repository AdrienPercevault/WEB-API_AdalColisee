from pymongo import MongoClient
from dotenv import load_dotenv

import os


load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')
DATABASE_NAME = os.getenv('DATABASE_NAME')



# ----- TEAM API ----- #
# -------------------- #
class TeamsMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGODB_URL, connect=False)
        database = DATABASE_NAME
        collection = "Teams"

        cursor = self.client[database]
        self.collection = cursor[collection]
        self.collection.create_index('team_name', unique=True)

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by score.
	# We are removing key ‘_id’ as it is containing MongoDB’s internal object ID and is of no use to the user.
    def read_teams(self):
        documents = self.collection.find({}, {'_id':0}).sort([('team_score', -1),('team_name', 1)])
        return [document for document in documents]

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by name.
	# We are removing key ‘_id’ as it is containing MongoDB’s internal object ID and is of no use to the user.
    def read_teams_alphabetics(self):
        documents = self.collection.find({}, {'_id':0}).sort('team_name', 1)
        return [document for document in documents]

	# Read One Method
    # This method allows us to read one specific document present in our collection.
    # We are removing key ‘_id’ as it is containing MongoDB’s internal object ID and is of no use to the user.
    def read_one_team(self, selector):         
        return self.collection.find_one(selector, {'_id':0})

	# Write Method
	# This method allows us to add a new document in our collection. 
    def write_team(self, document):
        response = self.collection.insert_one(document)
        return {'Status': 'Successfully Inserted', 'Document_ID': str(response.inserted_id)}

	# Update Method
	# This method allows us to update one existing document in our collection.
    def update_team(self, selector, document):
        response = self.collection.update_one(selector, document)
        return {'Status': 'Successfully Updated' if response.modified_count > 0 else "Nothing was updated."}

	# Delete Method
	# This method allows us to delete one existing document in our collection.
    def delete_team(self, selector):
        response = self.collection.delete_one(selector)
        return {'Status': 'Successfully Deleted' if response.deleted_count > 0 else "Document not found."}





# ----- GAMES API ----- #
# --------------------- #
class GamesMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGODB_URL, connect=False)
        database = DATABASE_NAME
        collection = "Games"

        cursor = self.client[database]
        self.collection = cursor[collection]
        self.collection.create_index('game_id', unique=True)

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by the game id.
    def read_games(self):
        documents = self.collection.find({}, {'_id':0}).sort('game_id', 1)
        return [document for document in documents]

	# Read Method
	# This method allows us to read all of the documents present in our collection containing a specific team name and sort it by the game id.
    def read_games_by_name(self, team_name):
        blue_side_documents = self.collection.find({'team_blue_side':team_name}, {'_id':0}).sort('game_id', 1)
        red_side_documents = self.collection.find({'team_red_side':team_name}, {'_id':0}).sort('game_id', 1)
        blue_side_list = [document for document in blue_side_documents]
        red_side_list = [document for document in red_side_documents]
        return blue_side_list + red_side_list

	# Read One Method
    # This method allows us to read one specific document present in our collection.
    def read_one_game(self, selector):         
        return self.collection.find_one(selector, {'_id':0})

	# Write Method
	# This method allows us to add a new document in our collection. 
    def write_game(self, document):
        response = self.collection.insert_one(document)
        return {'Status': 'Successfully Inserted', 'Document_ID': str(response.inserted_id)}

	# Update Method
	# This method allows us to update one existing document in our collection.
    def update_game(self, selector, document):
        response = self.collection.update_one(selector, document)
        return {'Status': 'Successfully Updated' if response.modified_count > 0 else "Nothing was updated."}

	# Delete Method
	# This method allows us to delete one existing document in our collection.
    def delete_game(self, selector):
        response = self.collection.delete_one(selector)
        return {'Status': 'Successfully Deleted' if response.deleted_count > 0 else "Document not found."}





# ----- PLANNING API ----- #
# ------------------------ #
class SchedulesMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGODB_URL, connect=False)
        database = DATABASE_NAME
        collection = "Schedules"

        cursor = self.client[database]
        self.collection = cursor[collection]
        self.collection.create_index('league', unique=True)

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by the game id.
    def read_schedules(self):
        documents = self.collection.find({}, {'_id':0}).sort('league', 1)
        return [document for document in documents]

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by the game id.
    def read_one_schedule(self, selector):         
        return self.collection.find_one(selector, {'_id':0})

	# Write Method
	# This method allows us to add a new document in our collection. 
    def write_schedule(self, document):
        response = self.collection.insert_one(document)
        return {'Status': 'Successfully Inserted', 'Document_ID': str(response.inserted_id)}

	# Update Method
	# This method allows us to update one existing document in our collection.
    def update_schedule(self, selector, document):
        response = self.collection.update_one(selector, document)
        return {'Status': 'Successfully Updated' if response.modified_count > 0 else "Nothing was updated."}

	# Delete Method
	# This method allows us to delete one existing document in our collection.
    def delete_schedule(self, selector):
        response = self.collection.delete_one(selector)
        return {'Status': 'Successfully Deleted' if response.deleted_count > 0 else "Document not found."}





# ----- STATS API ----- #
# --------------------- #
class StatsMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGODB_URL, connect=False)
        database = DATABASE_NAME
        collection = "Stats"

        cursor = self.client[database]
        self.collection = cursor[collection]
        self.collection.create_index('season', unique=True)

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by the game id.
    def read_stats(self):
        documents = self.collection.find({}, {'_id':0}).sort('season', 1)
        return [document for document in documents]

	# Read One Method
    # This method allows us to read one specific document present in our collection.
    def read_one_stat(self, selector):
        return self.collection.find_one(selector, {'_id':0})

	# Write Method
	# This method allows us to add a new document in our collection. 
    def write_stat(self, document):
        response = self.collection.insert_one(document)
        return {'Status': 'Successfully Inserted', 'Document_ID': str(response.inserted_id)}

	# Update Method
	# This method allows us to update one existing document in our collection.
    def update_stat(self, selector, document):
        response = self.collection.update_one(selector, document)
        return {'Status': 'Successfully Updated' if response.modified_count > 0 else "Nothing was updated."}





# ----- USER API ----- #
# -------------------- #
class UsersMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGODB_URL)
        database = DATABASE_NAME
        collection = "Users"

        cursor = self.client[database]
        self.collection = cursor[collection]
        self.collection.create_index('user_name', unique=True)

	# Read Method
    # This method allows us to find all users in our users collection.
    def read_users(self):
        documents = self.collection.find({}, {'_id':0}).sort('user_name', 1)
        return [document for document in documents]

	# Read One Method
    # This method allows us to find one user in our users collection. 
    def read_one_user(self, selector):         
        return self.collection.find_one(selector, {'_id':0})

	# Write Method
	# This method allows us to add a user in our users collection. 
    def write_user(self, document):
        response = self.collection.insert_one(document)
        return {'Status': 'Successfully Inserted', 'Document_ID': str(response.inserted_id)}
