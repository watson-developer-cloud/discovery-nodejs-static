/* eslint max-len: "off", no-console: "off" */
const httpTransport = require('https');
const moment = require('moment');

const Fetcher = function fetcher() {
};

Fetcher.prototype.queryPath = function queryPath(queryId) {
  const environmentId = process.env.DISCOVERY_ENVIRONMENT || '6d8cc198-9269-4757-bb31-3beae346d17a';
  const collectionId = process.env.DISCOVERY_COLLECTION || 'cad19f12-9ace-42d2-a5c8-a8c46da43ce1';
  const baseQuery = `/discovery-experimental/api/v1/environments/${environmentId}/collections/${collectionId}/query`;
  const versionCount = 'version=2016-11-09&count=10';

  const sushiPubDate = `publicationDate.date%3E%3D${moment().subtract(40, 'days').format('YYYYMMDD')}`;
  const mcPubDate = `publicationDate.date%3E%3D${moment().subtract(60, 'days').format('YYYYMMDD')}`;
  const pPubDate = `publicationDate.date%3E%3D${moment().subtract(90, 'days').format('YYYYMMDD')}`;
  const oPubDate = `publicationDate.date%3E%3D${moment().subtract(7, 'days').format('YYYYMMDD')}`;
  const wPubDate = `publicationDate.date%3E%3D${moment().subtract(60, 'days').format('YYYYMMDD')}`;
  const cPubDate = `publicationDate.date%3E%3D${moment().subtract(90, 'days').format('YYYYMMDD')}`;

  const sushiFilter = `filter=taxonomy:(label:food%20and%20drink),enrichedTitle.text:sushi,${sushiPubDate}`;
  const mFilter = `filter=enrichedTitle.text:Men%27s,taxonomy:(label:shopping),${mcPubDate}`;
  const pFilter = `filter=enrichedTitle.text:Patents,taxonomy:(label:law%20govt%20and%20politics),${pPubDate}`;
  const oFilter = `filter=taxonomy:(label:education),entities:(text:Barack%20Obama,type:person),${oPubDate}`;
  const wFilter = `filter=taxonomy:(label:sports),enrichedTitle.text:wearable,${wPubDate}`;
  const cFilter = `filter=enrichedTitle.text:"Cognitive%20Computing",${cPubDate}`;

  const mcReturn = 'return=enrichedTitle.text,url,enrichedTitle.docSentiment,publicationDate';
  const wcReturn = 'return=enrichedTitle.text,url,author,entities,concepts,taxonomy';

  const query = {
    sushi: `${baseQuery}?${versionCount}&${sushiFilter}&return=enrichedTitle.text,url,enrichedTitle.docSentiment`,
    mens_clothing: `${baseQuery}?${versionCount}&${mFilter}&${mcReturn}`,
    patents: `${baseQuery}?${versionCount}&${pFilter}&return=enrichedTitle.text,url,author,entities,concepts,taxonomy`,
    obama: `${baseQuery}?${versionCount}&${oFilter}&return=enrichedTitle.text,url,author,entities,concepts,taxonomy`,
    wearables_in_sport: `${baseQuery}?${versionCount}&${wFilter}&${wcReturn}`,
    cognitive_computing: `${baseQuery}?${versionCount}&${cFilter}&${wcReturn}`,
  }[queryId];
  return query;
};

Fetcher.prototype.fieldParams = function fieldParams(queryId) {
  const fieldGen = function fieldGen(dateRange, wherev, mentionedAs, sentiment, taxonomy, searchOver) {
    return [
      {
        label: 'Search articles over',
        value: dateRange,
        inputId: 'inputDateRange',
      },
      {
        label: 'Where',
        value: wherev,
        inputId: 'inputEntity',
      },
      {
        label: 'is mentioned',
        value: mentionedAs,
        inputId: 'inputEntityType',
      },
      {
        label: 'and the Sentiment is',
        value: sentiment,
        inputId: 'inputSentiment',
      },
      {
        label: 'where the Taxonomy is',
        value: taxonomy,
        inputId: 'inputTaxonomy',
      },
      {
        label: 'Search articles over',
        value: searchOver,
        inputId: 'inputArticle',
      },
    ];
  };

  const today = moment().format('MM/DD/YYYY');
  const sevenDaysAgo = moment().subtract(7, 'days').format('MM/DD/YYYY');
  const sixtyDaysAgo = moment().subtract(30, 'days').format('MM/DD/YYYY');
  const fourtyDaysAgo = moment().subtract(40, 'days').format('MM/DD/YYYY');
  const ninetyDaysAgo = moment().subtract(90, 'days').format('MM/DD/YYYY');

  const fields = {
    mens_clothing: fieldGen(`${sixtyDaysAgo} - ${today}`, 'Men\'s', 'anywhere', 'Any', 'Shopping', 'Title'),
    patents: fieldGen(`${ninetyDaysAgo} - ${today}`, 'Patents', 'anywhere', 'Any', 'Law, Government and Politics', 'Body'),
    obama: fieldGen(`${sevenDaysAgo} - ${today}`, 'Barack Obama', 'as a Person', 'Any', 'Education', 'Title'),
    wearables_in_sport: fieldGen(`${sixtyDaysAgo} - ${today}`, 'wearables', 'anywhere', 'Any', 'Sports', 'Title'),
    sushi: fieldGen(`${fourtyDaysAgo} - ${today}`, 'Sushi', 'anywhere', 'Any', 'Food and Drink', 'Title'),
    cognitive_computing: fieldGen(`${ninetyDaysAgo} - ${today}`, 'Cognitive Computing', 'anywhere', 'Any', 'Any', 'Title'),
  };

  return fields[queryId];
};

Fetcher.prototype.fetchPompipeData = function fetchPompipeData(queryId, callback) {
  const username = process.env.DISCOVERY_USERNAME;
  const password = process.env.DISCOVERY_PASSWORD;
  const apiHostname = process.env.DISCOVERY_HOST || 'gateway.watsonplatform.net';
  const responseEncoding = 'utf8';
  const httpOptions = {
    hostname: apiHostname,
    port: '443',
    path: this.queryPath(queryId),
    method: 'GET',
    auth: `${username}:${password}`,
    headers: {},
  };

  const request = httpTransport.request(httpOptions, (res) => {
    const responseBufs = [];
    let responseStr = '';

    res.on('data', (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        responseBufs.push(chunk);
      } else {
        responseStr += chunk;
      }
    }).on('end', () => {
      responseStr = responseBufs.length > 0 ?
  Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
      callback(null, res.statusCode, res.headers, responseStr);
    });
  }).setTimeout(6)
  .on('error', (error) => {
    console.log(error, httpOptions.path);
  });
  request.write('');
  request.end();
};

module.exports = Fetcher;
