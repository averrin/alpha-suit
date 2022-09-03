#!/bin/sh

echo Project: $(cat ./package.json | jq -r .name)
cc=$(cat ./package.json | jq -r ".dependencies[\"crew-components\"]")
if [ "$cc" != "github:averrin/crew-components" ]
then
  echo "!!! Fix crew-components path first !!!"
  exit 127
fi
echo Action:
ACTION=$(gum choose "build" "commit" "release")

case $ACTION in
  build)
    npm run build;;
  commit)
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
esac
