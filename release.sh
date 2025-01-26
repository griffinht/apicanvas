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

# Pull latest changes
echo "Pulling latest changes..."
git pull origin $current_branch

# Bump patch version in package.json and create git tag
echo "Bumping patch version..."
npm version patch

# Push changes and tags
echo "Pushing changes and tags..."
git push origin $current_branch --tags

echo "Release complete! 🎉" 