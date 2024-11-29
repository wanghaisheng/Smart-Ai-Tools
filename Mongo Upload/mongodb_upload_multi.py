import json
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from bson import ObjectId
import time
import sys
from pathlib import Path

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
    """Transform the tool data to ensure it matches our MongoDB schema"""
    # Create a default admin user ID
    admin_user_id = ObjectId("000000000000000000000000")
    
    # Ensure pricing matches the enum values in the schema
    pricing_map = {
        "free": "Free",
        "freemium": "Freemium",
        "paid": "Paid",
        "contact for pricing": "Contact for Pricing",
        "unknown": "Unknown"
    }
    normalized_pricing = pricing_map.get(tool.get("pricing", "").lower(), "Unknown")
    
    # Ensure all required fields are present with default values if missing
    return {
        "name": tool.get("name", ""),
        "description": tool.get("description", ""),
        "website": tool.get("website", ""),
        "image": tool.get("image", "https://via.placeholder.com/400x225?text=AI+Tool"),
        "category": tool.get("category", "Other"),
        "pricing": normalized_pricing,
        "features": tool.get("features", []),
        "tags": tool.get("tags", []),
        "submittedBy": ObjectId(tool.get("submittedBy", str(admin_user_id))),
        "status": "approved",  # Set all tools to approved status
        "rating": {
            "average": tool.get("rating", {}).get("average", 0),
            "count": tool.get("rating", {}).get("count", 0)
        },
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

def process_json_file(file_path, collection, stats):
    """Process a single JSON file and update stats"""
    try:
        print(f"\nProcessing file: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            tools_data = data.get("tools", [])
        
        print(f"Found {len(tools_data)} tools in file")
        
        # Process and insert each tool
        file_processed = 0
        file_new = 0
        file_skipped = 0
        
        for tool in tools_data:
            try:
                # Transform the data to match our schema
                transformed_tool = transform_tool_data(tool)
                
                # Check if tool already exists
                existing_tool = collection.find_one({
                    "$or": [
                        {"name": transformed_tool["name"]},
                        {"website": transformed_tool["website"]}
                    ]
                })
                
                if existing_tool:
                    file_skipped += 1
                    file_processed += 1
                    continue
                
                # Insert only if tool doesn't exist
                result = collection.insert_one(transformed_tool)
                
                file_processed += 1
                if result.inserted_id:
                    file_new += 1
                
                if file_processed % 10 == 0:
                    print(f"Progress: {file_processed}/{len(tools_data)} tools processed")
                
            except Exception as e:
                print(f"Error processing tool {tool.get('name', 'unknown')}: {str(e)}")
                continue
        
        # Update overall stats
        stats['total_processed'] += file_processed
        stats['total_new'] += file_new
        stats['total_skipped'] += file_skipped
        stats['files_processed'] += 1
        
        print(f"\nFile Summary:")
        print(f"Processed: {file_processed}")
        print(f"New tools added: {file_new}")
        print(f"Skipped (duplicates): {file_skipped}")
        
        return True
    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")
        stats['failed_files'].append(str(file_path))
        return False

def upload_to_mongodb(json_files):
    """Upload multiple JSON files to MongoDB"""
    try:
        # Load environment variables
        env_path = 'ai-tools-directory/server/.env'
        load_dotenv(env_path)
        
        # Connect to MongoDB using URI from .env
        mongodb_uri = os.getenv('MONGODB_URI')
        if not mongodb_uri:
            raise ValueError("MongoDB URI not found in .env file")
            
        client = MongoClient(mongodb_uri)
        db = client['test']
        collection = db['tools']

        # Check existing data first
        print("\nChecking existing data...")
        existing_count = check_existing_data(collection)
        
        # Count total tools in all files
        total_tools = 0
        for file_path in json_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    total_tools += len(data.get("tools", []))
            except Exception as e:
                print(f"Error reading file {file_path}: {str(e)}")
                continue
        
        print(f"\nTotal tools found in all files: {total_tools}")
        
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

        # Initialize statistics
        stats = {
            'total_processed': 0,
            'total_new': 0,
            'total_skipped': 0,
            'files_processed': 0,
            'failed_files': []
        }

        # Process each file
        for file_path in json_files:
            process_json_file(file_path, collection, stats)

        # Print final summary
        print("\n=== Final Summary ===")
        print(f"Files processed successfully: {stats['files_processed']}/{len(json_files)}")
        if stats['failed_files']:
            print(f"Failed files: {', '.join(stats['failed_files'])}")
        print(f"Total tools processed: {stats['total_processed']}")
        print(f"Total new tools added: {stats['total_new']}")
        print(f"Total tools skipped: {stats['total_skipped']}")
        print(f"Final total in database: {collection.count_documents({})}")

    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    # Get JSON files from command line arguments or use default directory
    if len(sys.argv) > 1 and sys.argv[1] != "--confirm":
        json_files = [arg for arg in sys.argv[1:] if arg != "--confirm" and arg.endswith('.json')]
    else:
        # Default to all JSON files in the Converted directory
        converted_dir = Path('AirTable/Converted')
        json_files = list(converted_dir.glob('*.json'))
    
    if not json_files:
        print("No JSON files found to process!")
        sys.exit(1)
    
    print(f"Found {len(json_files)} JSON files to process:")
    for file in json_files:
        print(f"- {file}")
    
    upload_to_mongodb(json_files)
