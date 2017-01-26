/* eslint max-len: "off", no-console: "off" */
const request = require('request');
const moment = require('moment');

const Fetcher = function fetcher() {
};

Fetcher.prototype.queryPath = function queryPath(queryId) {
  const environmentId = process.env.DISCOVERY_ENVIRONMENT || 'eeb606be-b79a-442b-8612-68ff81d8e46f';
  const collectionId = process.env.DISCOVERY_COLLECTION || 'e5c88c17-a12d-4403-bf70-fa76ef0cd97e';
  const baseQuery = `/discovery/api/v1/environments/${environmentId}/collections/${collectionId}/query`;
  const versionCount = 'version=2016-11-09&count=10';

  const sushiPubDate = `publicationDate.date%3E%3D${moment().subtract(40, 'days').format('YYYYMMDD')}`;
  const mcPubDate = `publicationDate.date%3E%3D${moment().subtract(60, 'days').format('YYYYMMDD')}`;
  const pPubDate = `publicationDate.date%3E%3D${moment().subtract(90, 'days').format('YYYYMMDD')}`;
  const oPubDate = `publicationDate.date%3E%3D${moment().subtract(7, 'days').format('YYYYMMDD')}`;
  const wPubDate = `publicationDate.date%3E%3D${moment().subtract(60, 'days').format('YYYYMMDD')}`;
  const cPubDate = `publicationDate.date%3E%3D${moment().subtract(90, 'days').format('YYYYMMDD')}`;

  const english = 'language:english';

  const sushiFilter = `filter=taxonomy:(label:food%20and%20drink),enrichedTitle.text:sushi,${sushiPubDate},${english}`;
  const mFilter = `filter=enrichedTitle.text:Men%27s,taxonomy:(label:shopping),${mcPubDate},${english}`;
  const pFilter = `filter=enrichedTitle.text:Patents,taxonomy:(label:law%20govt%20and%20politics),${pPubDate},${english}`;
  const oFilter = `filter=taxonomy:(label:education,score>0.5),entities:(text:Donald%20Trump,type:person),${oPubDate},${english}`;
  const wFilter = `filter=taxonomy:(label:sports),enrichedTitle.text:wearable,${wPubDate},${english}`;
  const cFilter = `filter=enrichedTitle.text:"Cognitive%20Computing",${cPubDate},${english}`;

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
    obama: fieldGen(`${sevenDaysAgo} - ${today}`, 'Donald Trump', 'as a Person', 'Any', 'Education', 'Title'),
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
  const fullUrl = `https://${username}:${password}@${apiHostname}${this.queryPath(queryId)}`;
  console.log(fullUrl);
  request(fullUrl, (error, response, body) => {
    callback(null, response.statusCode, response.headers, body);
  });
};

module.exports = Fetcher;
