cd client
call npm run build
rmdir "../server/build" /s /q
mkdir "../server/build"
xcopy "build" "../server/build" /s /e
cd "../server"
call gcloud app deploy --no-promote