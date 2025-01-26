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

# Get the version bump type from argument
bump_type=$1

# Validate bump type
if [[ "$bump_type" != "patch" && "$bump_type" != "minor" && "$bump_type" != "major" ]]; then
    echo "Error: Please specify version bump type: patch, minor, or major"
    echo "Usage: ./release.sh <patch|minor|major>"
    exit 1
fi

# Pull latest changes
echo "Pulling latest changes..."
git pull origin $current_branch

# Bump version in package.json and create git tag
echo "Bumping $bump_type version..."
npm version $bump_type

# Push changes and tags
echo "Pushing changes and tags..."
git push origin $current_branch --tags

echo "Release complete! 🎉" 