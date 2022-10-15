from pymongo import MongoClient


MONGO_URL = 'mongodb://localhost:27017/'
DATABASE_NAME = 'AdalColisee'
COLLECTION_NAME_TEAMS = 'Teams'
COLLECTION_NAME_USERS = 'Users'

# TEAM API
class TeamsMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGO_URL)  
        database = DATABASE_NAME
        collection = COLLECTION_NAME_TEAMS

        cursor = self.client[database]
        self.collection = cursor[collection]
        self.collection.create_index('team_name', unique=True)

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by score.
	# We are removing key ‘_id’ as it is containing MongoDB’s internal object ID and is of no use to the user.
    def read(self):
        documents = self.collection.find({}, {'_id':0}).sort([('team_score', -1),('team_name', 1)])
        return [document for document in documents]

	# Read Method
	# This method allows us to read all of the documents present in our collection and sort it by name.
	# We are removing key ‘_id’ as it is containing MongoDB’s internal object ID and is of no use to the user.
    def read_alphabetics(self):
        documents = self.collection.find({}, {'_id':0}).sort('team_name', 1)
        return [document for document in documents]

	# Read One Method
    # This method allows us to read one specific document present in our collection.
    # We are removing key ‘_id’ as it is containing MongoDB’s internal object ID and is of no use to the user.
    def read_one(self, selector):         
        return self.collection.find_one(selector, {'_id':0})

	# Write Method
	# This method allows us to add a new document in our collection. 
    def write(self, document):
        response = self.collection.insert_one(document)
        return {'Status': 'Successfully Inserted', 'Document_ID': str(response.inserted_id)}

	# Update Method
	# This method allows us to update one existing document in our collection.
    def update(self, selector, document):
        response = self.collection.update_one(selector, document) # $set or $unset
        return {'Status': 'Successfully Updated' if response.modified_count > 0 else "Nothing was updated."}

	# Delete Method
	# This method allows us to delete one existing document in our collection.
    def delete(self, selector):
        response = self.collection.delete_one(selector)
        return {'Status': 'Successfully Deleted' if response.deleted_count > 0 else "Document not found."}



# USER API
class UsersMongoAPI:
    # Initialisation of Mongo Database informations.
    def __init__(self):
        self.client = MongoClient(MONGO_URL)  
        database = DATABASE_NAME
        collection = COLLECTION_NAME_USERS

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
