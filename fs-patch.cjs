'use strict';
// Windows fix: intercept fs operations on +types paths before libuv hits EPERM
const fs = require('fs');

const bad = (p) => typeof p === 'string' && p.includes('+types');
const noent = () => Object.assign(new Error('ENOENT'), { code: 'ENOENT' });

const _readdir = fs.readdir.bind(fs);
fs.readdir = (p, opts, cb) => {
  if (bad(p)) { (typeof opts === 'function' ? opts : cb)(null, []); return; }
  return _readdir(p, opts, cb);
};
const _readdirSync = fs.readdirSync.bind(fs);
fs.readdirSync = (p, opts) => bad(p) ? [] : _readdirSync(p, opts);

const _lstat = fs.lstat.bind(fs);
fs.lstat = (p, opts, cb) => {
  if (bad(p)) { (typeof opts === 'function' ? opts : cb)(noent()); return; }
  return _lstat(p, opts, cb);
};
const _lstatSync = fs.lstatSync.bind(fs);
fs.lstatSync = (p, opts) => { if (bad(p)) throw noent(); return _lstatSync(p, opts); };

const _stat = fs.stat.bind(fs);
fs.stat = (p, opts, cb) => {
  if (bad(p)) { (typeof opts === 'function' ? opts : cb)(noent()); return; }
  return _stat(p, opts, cb);
};
const _statSync = fs.statSync.bind(fs);
fs.statSync = (p, opts) => { if (bad(p)) throw noent(); return _statSync(p, opts); };

const _pr = fs.promises.readdir.bind(fs.promises);
fs.promises.readdir = (p, o) => bad(p) ? Promise.resolve([]) : _pr(p, o);
const _pl = fs.promises.lstat.bind(fs.promises);
fs.promises.lstat = (p, o) => bad(p) ? Promise.reject(noent()) : _pl(p, o);
const _ps = fs.promises.stat.bind(fs.promises);
fs.promises.stat = (p, o) => bad(p) ? Promise.reject(noent()) : _ps(p, o);
