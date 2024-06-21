import requests
from bs4 import BeautifulSoup
import re
import json

# URL to fetch data from
url = "https://airquality.ie/readings?station=EPA-21&dateFrom=09+Jun+2024&dateTo=10+Jun+2024"

# Send GET request
response = requests.get(url)

# Check if request was successful
if response.status_code == 200:
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Use regex to find the JavaScript variable lineChart
    script_tag = soup.find("script", string=re.compile(r"var\s+lineChart\s*=\s*\{"))
    if script_tag:
        script_content = script_tag.string

        # Extract the 'lineChart' object from the script content
        line_chart_match = re.search(r"var\s+lineChart\s*=\s*(\{.*?\});", script_content, re.DOTALL)
        if line_chart_match:
            line_chart_data = line_chart_match.group(1)

            # Remove JavaScript comments
            line_chart_data = re.sub(r"//.*?\n|/\*.*?\*/", "", line_chart_data, flags=re.DOTALL)

            # Replace JavaScript-specific syntax with JSON-compatible syntax
            line_chart_data = re.sub(r'(\w+)\s*:', r'"\1":', line_chart_data)

            # Handle specific case of incorrect double quotes inside dateTimeLabelFormats
            line_chart_data = line_chart_data.replace('%H', '"%H"').replace('%M', '"%M"')

            try:
                # Parse the cleaned lineChart data as JSON
                line_chart_json = json.loads(line_chart_data)

                # Extract the 'series' data
                series_data = line_chart_json.get("options", {}).get("series", [])

                # Print the 'series' data in JSON format
                print(json.dumps(series_data, indent=4))
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print("Failed to decode cleaned lineChart data.")
        else:
            print("Could not find the 'lineChart' data in the script.")
    else:
        print("Could not find the script tag containing the lineChart variable.")
else:
    print(f"Failed to fetch data. HTTP Status code: {response.status_code}")
