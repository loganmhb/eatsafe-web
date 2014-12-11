from flask import Flask, request, render_template
app = Flask(__name__)

import urllib, urllib2, os

@app.route('/')
def index():
    return render_template('index.html', maps_key=os.environ.get('GOOGLE_MAPS_KEY'))

@app.route('/api/<target>')
def apiAccess(target):
    queryUrl = 'http://api.eatsafechicago.com/' + target + '?' \
               + urllib.urlencode(request.args)
    req = urllib2.Request(queryUrl)
    response = urllib2.urlopen(req)
    return response.read()
    
if __name__ == '__main__':
    app.run(debug=False)
