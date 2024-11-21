import json
from collections import defaultdict

def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def find_duplicates(data):
    # Initialize dictionaries to store items by different keys
    by_id = defaultdict(list)
    by_title = defaultdict(list)
    by_url = defaultdict(list)
    by_subtitle = defaultdict(list)

    # Iterate through all items
    for idx, item in enumerate(data):
        fields = item.get('fields', {})
        
        # Store items by different keys
        by_id[item['id']].append((idx, item))
        if 'Title' in fields:
            by_title[fields['Title']].append((idx, item))
        if 'Call To Action URL' in fields:
            by_url[fields['Call To Action URL']].append((idx, item))
        if 'Subtitle' in fields:
            # Strip whitespace and newlines for better comparison
            clean_subtitle = fields['Subtitle'].strip()
            by_subtitle[clean_subtitle].append((idx, item))

    # Find duplicates
    duplicate_results = {
        'by_id': [(k, v) for k, v in by_id.items() if len(v) > 1],
        'by_title': [(k, v) for k, v in by_title.items() if len(v) > 1],
        'by_url': [(k, v) for k, v in by_url.items() if len(v) > 1],
        'by_subtitle': [(k, v) for k, v in by_subtitle.items() if len(v) > 1]
    }

    return duplicate_results

def print_duplicates(duplicates):
    print("\n=== Analysis Results ===\n")
    
    # Check for exact ID duplicates (shouldn't happen in a well-formed database)
    if duplicates['by_id']:
        print("\nDuplicate IDs found (This shouldn't happen!):")
        for id_val, items in duplicates['by_id']:
            print(f"\nID: {id_val}")
            for idx, item in items:
                print(f"  Index {idx}: {item['fields'].get('Title', 'No Title')}")
    else:
        print("✓ No duplicate IDs found (Good!)")

    # Check title duplicates
    if duplicates['by_title']:
        print("\nDuplicate Titles found:")
        for title, items in duplicates['by_title']:
            print(f"\nTitle: {title}")
            for idx, item in items:
                print(f"  Index {idx}: ID: {item['id']}")
                print(f"    Subtitle: {item['fields'].get('Subtitle', 'No Subtitle')[:100]}...")
    else:
        print("✓ No duplicate titles found")

    # Check URL duplicates
    if duplicates['by_url']:
        print("\nDuplicate URLs found:")
        for url, items in duplicates['by_url']:
            print(f"\nURL: {url}")
            for idx, item in items:
                print(f"  Index {idx}: {item['fields'].get('Title', 'No Title')}")
    else:
        print("✓ No duplicate URLs found")

    # Check subtitle duplicates
    if duplicates['by_subtitle']:
        print("\nDuplicate Subtitles found:")
        for subtitle, items in duplicates['by_subtitle']:
            print(f"\nSubtitle: {subtitle[:100]}...")
            for idx, item in items:
                print(f"  Index {idx}: {item['fields'].get('Title', 'No Title')}")
    else:
        print("✓ No duplicate subtitles found")

def main():
    file_path = 'Data01.json'
    try:
        data = load_json_file(file_path)
        duplicates = find_duplicates(data)
        print_duplicates(duplicates)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
