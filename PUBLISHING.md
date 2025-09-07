# Automated Publishing Setup

This repository uses GitHub Actions to automatically publish to npm when code is pushed to the main branch.

## How it Works

The workflow (`.github/workflows/publish.yml`) triggers on:
- Pushes to the `main` branch
- Only when code files change (ignores README.md, examples, etc.)

The workflow will:
1. ✅ Install dependencies
2. ✅ Run tests
3. ✅ Run linting
4. ✅ Build the package
5. ✅ Check if package.json version has changed
6. ✅ Publish to npm (only if version changed)
7. ✅ Create a git tag with the version number

## Required Setup

### 1. NPM Token
You need to create an NPM access token and add it to GitHub secrets:

1. Go to [npm.com](https://npmjs.com) → Account → Access Tokens
2. Create a new "Automation" token
3. Copy the token
4. Go to your GitHub repo → Settings → Secrets and Variables → Actions
5. Add a new repository secret named `NPM_TOKEN` with the token value

### 2. Repository Settings
Make sure the repository has:
- ✅ Write permissions for GitHub Actions (Settings → Actions → General)
- ✅ Allow GitHub Actions to create and approve pull requests (if needed)

## Publishing Process

To publish a new version:

1. **Update the version** in `package.json`:
   ```bash
   # For bug fixes
   npm version patch   # 0.2.0 → 0.2.1
   
   # For new features
   npm version minor   # 0.2.0 → 0.3.0
   
   # For breaking changes
   npm version major   # 0.2.0 → 1.0.0
   ```

2. **Push to main**:
   ```bash
   git add package.json
   git commit -m "Bump version to x.x.x"
   git push origin main
   ```

3. **GitHub Actions will automatically**:
   - Run tests and build
   - Publish to npm (if version changed)
   - Create a git tag

## Workflow Features

- ✅ **Version checking**: Only publishes if version in package.json has changed
- ✅ **Quality gates**: Tests and linting must pass before publishing
- ✅ **Automatic tagging**: Creates git tags for published versions
- ✅ **Smart triggering**: Ignores documentation-only changes
- ✅ **Security**: Uses npm automation tokens

## Manual Publishing (if needed)

If you need to publish manually:
```bash
npm run build
npm test
npm publish --access public
```

## Monitoring

- Check the "Actions" tab in GitHub to see workflow runs
- Failed builds will show detailed logs
- Published packages appear at: https://www.npmjs.com/package/@nandbhat/mcp-client