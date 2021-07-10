from flask import Flask, render_template
import os

app = Flask(__name__, static_url_path='/static') 

# @app.route('/index')
def index(): 
    return render_template('index.html')

@app.route('/')
@app.route('/gallery')
def gallery(): 
    return render_template('gallery-new.html')

if __name__ == '__main__':
    # Run the app server on localhost:4449
    app.run(debug=False)