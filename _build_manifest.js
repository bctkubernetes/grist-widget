#!/usr/bin/env node
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc');

const rootDir = path.join(__dirname);

function isWidgetDir(dir) {
  return fs.existsSync(path.join(dir, 'index.html')) && fs.existsSync(path.join(dir, 'package.json'));
}

function listSubmodules(repoRoot) {
  const gitmodulesPath = path.join(repoRoot, '.gitmodules');
  if (!fs.existsSync(gitmodulesPath)) return [];
  const stdout = execSync('git config --file .gitmodules --get-regexp path', { cwd: repoRoot, encoding: 'utf-8' });
  return stdout.split('\n').map(line => line.split(' ')[1]).filter(Boolean);
}

const ALLOWED = jsonc.parse(fs.readFileSync(path.join(rootDir, 'external.jsonc'), 'utf-8').trim());
let folders = fs.readdirSync(rootDir).filter(f => !listSubmodules(rootDir).includes(f));

// Only add ALLOWED folders that actually exist on disk
for (const k of Object.keys(ALLOWED)) {
  const dir = path.join(rootDir, k);
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    folders.push(k);
  } else {
    console.log('SKIP missing external:', k);
  }
}

const widgets = [];
const widgetIds = new Set();

for (const folder of folders) {
  const dir = path.join(rootDir, folder);
  try {
    if (!fs.statSync(dir).isDirectory() || !isWidgetDir(dir)) continue;
  } catch(e) { continue; }

  const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json')));
  let configs = packageJson.grist;
  if (!configs) continue;

  if (ALLOWED[folder]) {
    configs = Array.isArray(configs) ? configs[0] : configs;
    configs = Object.assign({}, configs, ALLOWED[folder]);
  }

  configs = Array.isArray(configs) ? configs : [configs];
  for (const config of configs) {
    if (!config || !config.widgetId || !config.name || !config.url) continue;
    if (widgetIds.has(config.widgetId)) continue;
    widgetIds.add(config.widgetId);
    if (config.published) {
      try {
        config.lastUpdatedAt = execSync('git log -1 --format=%cI package.json', {cwd: dir, encoding: 'utf8'}).trimEnd();
      } catch(e) {}
      widgets.push(config);
      console.log('Publishing', config.widgetId);
    }
  }
}

fs.writeFileSync(path.join(rootDir, 'manifest.json'), JSON.stringify(widgets, null, 2));
console.log('\nTotal:', widgets.length, 'widgets in manifest.json');
