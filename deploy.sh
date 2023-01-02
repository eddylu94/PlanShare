start_time=`date +%s`

echo "Pulling latest changes"
git pull

cd server
echo "Removing server node_modules"
rm -rf node_modules
cd ..
cd client
echo "Removing client node_modules"
rm -rf node_modules
cd ..

cd server
echo "Installing server dependencies"
yarn install
cd ..
cd client
echo "Installing client dependencies"
yarn install

echo "Killing server process"
fuser -k 36322/tcp
echo "Killing client process"
fuser -k 36321/tcp

echo "Building client"
yarn build
cd ..

echo "Starting server"
screen -dm bash -c "cd server; yarn start"

echo "Starting client"
screen -dm bash -c "cd client; serve -l 36321 -s build"

end_time=`date +%s`

echo Application deployed
echo Execution time: `expr $end_time - $start_time` seconds