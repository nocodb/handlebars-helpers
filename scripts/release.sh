#!/bin/bash

# Release script for handlebars-helpers
set -e

echo "🚀 Starting release process for handlebars-helpers..."

# Ensure we're on main/master branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "master" ] && [ "$BRANCH" != "main" ]; then
  echo "❌ Error: Must be on master/main branch to release. Currently on: $BRANCH"
  exit 1
fi

# Ensure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Error: Working directory is not clean. Please commit or stash changes."
  git status
  exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Ask for new version
echo "🤔 What type of release is this?"
echo "  1) patch (bug fixes)"
echo "  2) minor (new features)"  
echo "  3) major (breaking changes)"
echo "  4) custom version"
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    VERSION_TYPE="patch"
    ;;
  2)
    VERSION_TYPE="minor"
    ;;
  3)
    VERSION_TYPE="major"
    ;;
  4)
    read -p "Enter custom version: " CUSTOM_VERSION
    VERSION_TYPE=$CUSTOM_VERSION
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

# Update version in package.json
if [ "$choice" = "4" ]; then
  NEW_VERSION=$VERSION_TYPE
  echo "🏷️  Setting version to: $NEW_VERSION"
  # Update package.json manually for custom version
  node -e "
    const pkg = require('./package.json');
    pkg.version = '$NEW_VERSION';
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
  "
else
  echo "🏷️  Bumping $VERSION_TYPE version..."
  NEW_VERSION=$(node -e "
    const semver = require('semver');
    const pkg = require('./package.json');
    const newVer = semver.inc(pkg.version, '$VERSION_TYPE');
    pkg.version = newVer;
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
    console.log(newVer);
  ")
fi

echo "📦 New version: $NEW_VERSION"

# Run tests
echo "🧪 Running tests..."
pnpm test

# Build the project
echo "🔨 Building project..."
pnpm build

# Add and commit version bump
echo "📝 Committing version bump..."
git add package.json
git commit -m "chore: bump version to $NEW_VERSION

🤖 Generated with release script

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create git tag
echo "🏷️  Creating git tag..."
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

# Push changes and tags
echo "📤 Pushing to remote..."
read -p "Push changes and tags to remote? (y/N): " push_confirm
if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
  git push origin $BRANCH
  git push origin "v$NEW_VERSION"
  echo "✅ Pushed changes and tags"
else
  echo "⏸️  Skipped pushing to remote"
fi

# Publish to npm
echo "📦 Publishing to npm..."
read -p "Publish to npm? (y/N): " publish_confirm
if [ "$publish_confirm" = "y" ] || [ "$publish_confirm" = "Y" ]; then
  echo "🚀 Publishing to npm..."
  pnpm publish --access public
  echo "✅ Published to npm!"
  echo "🎉 Release v$NEW_VERSION complete!"
  echo "📦 Package: https://www.npmjs.com/package/handlebars-helpers"
else
  echo "⏸️  Skipped npm publish"
  echo "💡 To publish later, run: pnpm publish --access public"
fi

echo "🎊 Release process finished!"