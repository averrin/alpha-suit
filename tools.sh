#!/bin/sh
v=$(git semver get)
p=$(cat ./package.json | jq -r .name)

echo "Project: {{ Bold \"$p\" }} $v" | gum format -t template
cc=$(cat ./package.json | jq -r ".dependencies[\"crew-components\"]")
echo Action:
ACTION=$(gum choose "commit" "release" "build" "dist" "dev")

case $ACTION in
  dev)
    npm run dev;;
  build)
    echo "Building..."
    npm run build;;
  commit)
if [ "$cc" != "github:averrin/crew-components" ]
then
  echo "!!! Fix crew-components path first !!!"
  exit 127
fi
    git status
    gum confirm "Commit changes?" || exit 128
    TYPE=$(gum choose "fix" "feat" "docs" "style" "refactor" "test" "chore" "revert")
    SCOPE=$(gum input --placeholder "scope")

    # Since the scope is optional, wrap it in parentheses if it has a value.
    test -n "$SCOPE" && SCOPE="($SCOPE)"

    # Pre-populate the input with the type(scope): so that the user may change it
    SUMMARY=$(gum input --value "$TYPE$SCOPE: " --placeholder "Summary of this change")
    DESCRIPTION=$(gum write --placeholder "Details of this change (CTRL+D to finish)")

    # Commit these changes
    gum confirm "Commit changes?" && git commit -a -m "$SUMMARY" -m "$DESCRIPTION" && git push
  ;;
  release)
    gum choose "patch" "minor" "major" | xargs git semver
    git push --tags
  ;;
  dist)
    echo "Building & making a local dist..."
    npm run build
    cd ..
    rm -rf ./${p}-dist;
    cp -r ./${p} ./${p}-dist;
    rm -rf ./${p}-dist/node_modules
  ;;
esac
echo "Done"
