git checkout $(Build.SourceBranchName)
git remote add heroku https://heroku:$(heroku)@git.heroku.com/playlist-converter-google.git
git push -f heroku $(Build.SourceBranchName)