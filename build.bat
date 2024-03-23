

cd projects/ui
ng build --configuration=production
cd ../../
cp -r ./projects/ui/src/themes
cd dist/ui
npm publish --access=public