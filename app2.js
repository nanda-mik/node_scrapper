const request = require('request-promise');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const parser = new xml2js.Parser();
const parse_url = require('parse-url');
const urlPack = require('url');
const ke = require('keyword-extractor');
const psi = require('psi');
const isImage = require('is-image');
const isRelativeUrl = require("is-relative-url");
const axios = require('axios');
const requestPromise = require('request-promise');

