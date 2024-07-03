Set-Location -Path ..

npx tsc

Remove-Item -Recurse -Force package -ErrorAction SilentlyContinue

New-Item -Path package -ItemType Directory

Copy-Item package.json package/
Set-Location -Path package
npm install

Set-Location -Path ..
Copy-Item -Recurse -Force dist/ package/