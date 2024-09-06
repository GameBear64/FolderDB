import path from 'path';
import * as fs from 'fs';
import { beforeAll, afterAll } from 'bun:test';

const DBPath = path.resolve('./test-db');
const ToolsPath = path.resolve('./tests/tools');

beforeAll(() => {
  fs.mkdirSync(DBPath);

  fs.copyFileSync(path.resolve(ToolsPath, 'products.json'), path.resolve(DBPath, 'products.json'));

  fs.mkdirSync(path.resolve(DBPath, 'users/posts'), { recursive: true });
  fs.copyFileSync(path.resolve(ToolsPath, 'user.json'), path.resolve(DBPath, 'users/gam.json'));
  fs.copyFileSync(path.resolve(ToolsPath, 'post.json'), path.resolve(DBPath, 'users/posts/first.json'));

  fs.mkdirSync(path.resolve(DBPath, 'assets'));
  fs.copyFileSync(path.resolve(ToolsPath, 'airplane.jpg'), path.resolve(DBPath, 'assets/airplane.jpg'));

  console.log('🏗️  Structure setup complete 🏗️');
});

afterAll(() => {
  fs.rmdirSync(DBPath, { recursive: true });

  console.log('🏗️  Structure teardown complete 🏗️');
});
