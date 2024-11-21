import json
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from bson import ObjectId
import time
import sys

def check_existing_data(collection):
    """Check and display information about existing data"""
    try:
        existing_count = collection.count_documents({})
        print(f"\nExisting tools in MongoDB: {existing_count}")
        
        # Get some sample categories
        categories = collection.distinct("category")
        print(f"Current categories: {', '.join(categories[:5])}...")
        
        return existing_count
    except Exception as e:
        print(f"Error checking existing data: {str(e)}")
        return 0

def backup_collection(collection, backup_name):
    """Create a backup of the existing collection"""
    try:
        # Get all documents from the collection
        existing_docs = list(collection.find({}))
        
        # Create a backup collection with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_collection_name = f"{backup_name}_backup_{timestamp}"
        
        if existing_docs:
            # Insert documents into backup collection
            db = collection.database
            db[backup_collection_name].insert_many(existing_docs)
            print(f"Backup created successfully: {backup_collection_name}")
            print(f"Backed up {len(existing_docs)} documents")
        else:
            print("No existing documents found to backup")
        return True
    except Exception as e:
        print(f"Backup failed: {str(e)}")
        return False

def transform_tool_data(tool):
    """Transform AirTable data format to match our MongoDB schema"""
    fields = tool["fields"]
    
    # Create a default admin user ID (you should replace this with a real admin user ID)
    admin_user_id = ObjectId("000000000000000000000000")
    
    # Handle pricing field mapping
    pricing = fields.get("Price", "Unknown")
    # Ensure pricing matches the enum values in the schema
    pricing_map = {
        "free": "Free",
        "freemium": "Freemium",
        "paid": "Paid",
        "contact for pricing": "Contact for Pricing",
        "unknown": "Unknown"
    }
    normalized_pricing = pricing_map.get(pricing.lower(), "Unknown")
    
    return {
        "name": fields.get("Title", ""),
        "description": fields.get("Subtitle", ""),
        "website": fields.get("Call To Action URL", ""),
        "image": fields.get("Gallery", "https://via.placeholder.com/400x225?text=AI+Tool"),
        "category": fields.get("Category", "Other").split(",")[0].strip(),  # Take first category if multiple
        "pricing": normalized_pricing,
        "features": [],  # No direct mapping from AirTable data
        "tags": [tag.strip() for tag in fields.get("Category", "").split(",") if tag.strip()],
        "submittedBy": admin_user_id,
        "status": "approved",  # Since these are imported tools, mark them as approved
        "rating": {
            "average": 0,
            "count": 0
        },
        "createdAt": datetime.strptime(tool.get("createdTime", datetime.utcnow().isoformat()), "%Y-%m-%dT%H:%M:%SZ"),
        "updatedAt": datetime.utcnow()
    }

def upload_to_mongodb():
    try:
        # Load environment variables
        env_path = 'ai-tools-directory/server/.env'
        load_dotenv(env_path)
        
        # Connect to MongoDB using URI from .env
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            raise ValueError("MongoDB URI not found in .env file")
            
        client = MongoClient(mongodb_uri)
        db = client['test']  # Using 'test' as it's the default MongoDB database
        collection = db['tools']

        # Check existing data first
        print("\nChecking existing data...")
        existing_count = check_existing_data(collection)
        
        # Read the JSON file to get new data count
        with open('AirTable/Data01.json', 'r', encoding='utf-8') as file:
            tools_data = json.load(file)
        
        print(f"\nNew tools in JSON file: {len(tools_data)}")
        
        # Ask for confirmation
        print("\nPlease check the numbers above.")
        print("To proceed with the upload, run the script with the --confirm flag")
        if "--confirm" not in sys.argv:
            print("Upload cancelled. Run with --confirm to proceed")
            return

        # Create backup before making any changes
        print("\nCreating backup of existing data...")
        if not backup_collection(collection, "tools"):
            raise Exception("Backup failed. Aborting upload process for safety.")

        # Keep track of progress
        total_tools = len(tools_data)
        processed_tools = 0
        new_tools = 0
        skipped_tools = 0

        print("\nStarting data upload process...")
        # Process and insert each tool
        for tool in tools_data:
            try:
                # Transform the data to match our schema
                transformed_tool = transform_tool_data(tool)
                
                # Check if tool already exists (by name or website)
                existing_tool = collection.find_one({
                    "$or": [
                        {"name": transformed_tool["name"]},
                        {"website": transformed_tool["website"]}
                    ]
                })
                
                if existing_tool:
                    skipped_tools += 1
                    processed_tools += 1
                    if processed_tools % 50 == 0:
                        print(f"Progress: {processed_tools}/{total_tools} tools processed")
                    continue
                
                # Insert only if tool doesn't exist
                result = collection.insert_one(transformed_tool)
                
                processed_tools += 1
                if result.inserted_id:
                    new_tools += 1
                
                if processed_tools % 50 == 0:
                    print(f"Progress: {processed_tools}/{total_tools} tools processed")
                
            except Exception as e:
                print(f"Error processing tool {tool.get('fields', {}).get('Title', 'unknown')}: {str(e)}")
                continue

        print("\nData upload completed successfully!")
        print(f"Total tools processed: {processed_tools}/{total_tools}")
        print(f"New tools added: {new_tools}")
        print(f"Existing tools skipped: {skipped_tools}")
        print(f"Final total in database: {collection.count_documents({})}")
        print(f"Backup collection available for reference")

    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    upload_to_mongodb()
