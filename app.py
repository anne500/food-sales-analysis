# -*- coding: utf-8 -*-
"""
Created on Sat Nov 30 21:55:51 2024

@author: ishani
"""

from flask import Flask, request, jsonify, render_template
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the dataset
try:
    df = pd.read_excel('sampledatafoodsales_analysis.xlsx', sheet_name='FoodSales')
    df['Date'] = pd.to_datetime(df['Date'])  # Ensure the Date column is in datetime format
except Exception as e:
    print(f"Error loading dataset: {e}")
    df = pd.DataFrame()  # Create an empty DataFrame to handle errors gracefully

@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "  # Allow resources from the same origin
        "script-src 'self';" # Temporarily Remove 'unsafe-eval'; "  # Allow 'eval' in scripts
        "style-src 'self' 'unsafe-inline'; "  # Allow only local and inline styles
        "img-src 'self' data:;"  # Allow local images and inline SVGs
    )
    response.headers['Cache-Control'] = 'public, max-age=31536000'
    return response

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return an empty response with HTTP 204 No Content

@app.route('/') 
def index():
    return render_template('index.html')

@app.route('/cities')
def cities():
    try:
        unique_cities = df['City'].dropna().unique().tolist()
        return jsonify(unique_cities)
    except KeyError as e:
        return jsonify({"error": f"Column error: {e}"}), 500

@app.route('/categories')
def categories():
    try:
        unique_categories = df['Category'].dropna().unique().tolist()
        return jsonify(unique_categories)
    except KeyError as e:
        return jsonify({"error": f"Column error: {e}"}), 500

@app.route('/filterData', methods=['GET'])
def filter_data():
    date_start = request.args.get('dateStart')
    date_end = request.args.get('dateEnd')
    city = request.args.get('city')
    category = request.args.get('category')

    try:
        filtered_df = df.copy()

        if date_start and date_end:
            filtered_df = filtered_df[
                (filtered_df['Date'] >= pd.to_datetime(date_start)) &
                (filtered_df['Date'] <= pd.to_datetime(date_end))
            ]
        if city:
            filtered_df = filtered_df[filtered_df['City'] == city]
        if category:
            filtered_df = filtered_df[filtered_df['Category'] == category]

        filtered_df['UnitPrice'] = filtered_df['UnitPrice'].apply(lambda x: f"{x:.2f}")
        filtered_df['TotalPrice'] = filtered_df['TotalPrice'].apply(lambda x: f"{x:.2f}")

        return jsonify(filtered_df.to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": f"Filtering error: {e}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Get the port from the environment
    app.run(host="0.0.0.0", port=port, debug=True)  # Run Flask on the specified host and port

