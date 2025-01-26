#!/bin/bash

# Ensure we're in a clean state
if [[ -n $(git status --porcelain) ]]; then
    echo "Error: Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Get the current branch
current_branch=$(git branch --show-current)

# Ensure we're on main/master branch
if [[ "$current_branch" != "main" && "$current_branch" != "master" ]]; then
    echo "Error: Please switch to main/master branch before releasing"
    exit 1
fi

# Get current version from package.json and increment patch
current_version=$(node -p "require('./package.json').version")
new_version=$(echo $current_version | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')

# Create a new tag
echo "Creating tag v$new_version..."
git tag -a "v$new_version" -m "Release v$new_version"

# Push tags
echo "Pushing tags..."
git push origin --follow-tags

echo "Release complete! 🎉" 
