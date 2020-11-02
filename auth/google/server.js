let express = require('express')
let querystring = require('querystring')

let {google} = require('googleapis');
let authClient = new google.auth.OAuth2(
  '351958591751-3rlg46hcqh3soiasec3kj6n33m0m1h6r.apps.googleusercontent.com',
  'B1K_CXLwGd5YCrRNDrJSgm8S',
  'http://localhost:8889/callback'
)

let app = express()

app.get('/auth',function(req,res)
{
  const url = authClient.generateAuthUrl(
    {
      access_type: 'offline',
      scope:'https://www.googleapis.com/auth/youtube.readonly'
    }
  )
  res.redirect(url);

})

app.get('/callback', async function(req,res)
{
  let code = req.query.code || null; 
  const {tokens} = await authClient.getToken(code);

  let redirect_uri = process.env.redirect_uri || 'http://localhost:3000/';
  res.redirect(redirect_uri + '?access_token_google=' + tokens.access_token);

})

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

let port = process.env.PORT || 8889
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)