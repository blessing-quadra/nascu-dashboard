

#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16

#create our working directory if it doesnt exist
DIR="/home/ec2-user/naccug"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi

# navigate to app folder
# cd /app

# install node and npm
# curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
# yum -y install nodejs npm