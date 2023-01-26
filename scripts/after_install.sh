#!/bin/bash

export HOME="/home/ec2-user/naccug"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# install dependencies
npm install

# install create-react-app and react-scripts
# without react-scripts application cannot be started
npm install --save create-react-app react-scripts

# install pm2 process manager
npm install pm2 -g