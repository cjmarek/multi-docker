This project was created from scratch.
So, to make it a brand new git repository, I run from the root folder (C:\UdemyReactCourse3\CheckpointVersion2)
git init
git add .
git commit -m "initial commit"

Then he said, we need to create a repo on GitHub .com and link it up to Travis CI
So, we go over to GitHub.com, click the + button at top right of GitHub home page
On the next page to appear, enter a new Repository name (I used multi-docker)
https://github.com/cjmarek/multi-docker.git retrieved from the copy link
Come back to the terminal,

git remote add origin https://github.com/cjmarek/multi-docker.git

next, to see what current remotes are available
git remote -v

git push origin master   or use the Visual Studio Code to push to GitHub.

Next, create a link between GitHub and Travis CI


* * * * * * * * * * 

Since it costs money to sign up for Travis CI, he said a free way to get this stuff done
is to use GitHub Actions. And then he never explains how. All he does is mention that there
is a deploy.yaml file that performs the steps. And that deploy.yaml is in .GitHub > workflows > deploy.yaml



