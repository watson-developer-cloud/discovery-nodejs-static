import React, { PropTypes } from 'react';


const Article = props =>
    (<div className="resultsItem">
      <div className="resultsItem--title">
        {props.title}
      </div>
      <div className="resultsItem--link">
        <a href={props.url}>{props.url}</a>
      </div>
    </div>);

Article.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

// eslint-disable-next-line
const ArticleList = (props) => {
  return !props.results ? <div className="empty" /> :
    (<div className="results-container--listing">
      <h5 className="base--h5 input--results-header">Results</h5>
      <div className="results--listing">
        {props.results.results.map(item =>
          <Article key={item.id} title={item.enrichedTitle.text} url={item.url} />)
        }
      </div>
    </div>);
};

ArticleList.propTypes = {
  results: PropTypes.object,
};

export default ArticleList;
