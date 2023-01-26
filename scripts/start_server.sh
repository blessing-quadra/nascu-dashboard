#!/bin/bash

#add npm and node to path
export HOME="/home/ec2-user/"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion



sudo PM2_HOME=/home/ec2-user/.pm2 pm2 list
#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/naccug

# navigate to app folder
cd /home/ec2-user/naccug


#install node modules
npm install --force

# install create-react-app and react-scripts
# without react-scripts application cannot be started
npm install --save create-react-app react-scripts --force

# install pm2 process manager
npm install pm2 -g
# initial startup by running react-script "start", name process "naccug"
# --watch watches and restarts if files change

pm2 start ./node_modules/react-scripts/scripts/start.js --name "naccug" --watch

# auto restart server if shut down
pm2 startup

# freeze process list for automatic respawn
pm2 save

# restart all processes - necessary to do this again?
pm2 restart all