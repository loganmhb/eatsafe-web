from flask import Flask, request, render_template
app = Flask(__name__)

import config

import urllib, urllib2

@app.route('/')
def index(): return render_template('index.html', maps_key=config.MAPS_KEY)

@app.route('/api/<target>')
def apiAccess(target):
    queryUrl = 'http://api.eatsafechicago.com/' + target + '?' \
               + urllib.urlencode(request.args)
    req = urllib2.Request(queryUrl)
    response = urllib2.urlopen(req)
    return response.read()
    
if __name__ == '__main__':
    app.run(debug=True)  ### Turn this OFF in production.
