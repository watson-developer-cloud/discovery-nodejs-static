
import React from 'react';
import { Tabs, Pane, RadioGroup, Radio, Icon } from 'watson-react-components';
import 'whatwg-fetch';

import ArticleList from './article.jsx';
import QueryParams from './query-params.jsx';
import QueryIcons from './query-icons.jsx';

const QUERIES = [
  { id: 'wearables_in_sport', text: 'Wearables used in sports', icon: 'watch' },
  { id: 'cognitive_computing', text: 'Articles about cognitive computing', icon: 'cognitive' },
  { id: 'obama', text: 'President\'s involvement in education', icon: 'education' },
  { id: 'patents', text: 'Latest info about Patent law', icon: 'gavel' },
  { id: 'mens_clothing', text: 'Men\'s clothing sales', icon: 'sale' },
  { id: 'sushi', text: 'Latest trends in the Sushi business', icon: 'sushi' },
];

export default React.createClass({
  getInitialState() {
    return { data: null, error: null, loading: false };
  },

  /**
   * Call the query API every time the user click on a sample query.
   * It also update the state with the results.
   * @param {integer} int The selected query id
   */
  onQueryChange(idx) {
    const query = QUERIES[idx].id;

    this.setState({ loading: true, error: null, data: null });

    fetch(`/api/query/${query}`).then((response) => {
      if (response.ok) {
        response.json()
          .then((json) => this.setState({ loading: false, data: json })
        );
      } else {
        response.json()
        .then((error) => this.setState({ error, loading: false }))
        .catch((errorMessage) => {
          console.error(errorMessage);
          this.setState({
            error: { error: 'There was a problem with the request, please try again' },
            loading: false,
          });
        });
      }
    });
  },

  render() {
    return (
      <section className="_container _container_large">
        <div className="row">
          <p className="base--p">
            Here are a few examples of the types of queries possible with Discovery's
            pre-enriched news content. Check out the results with returned articles,
            mentions and the raw JSON responses.
          </p>
          <div className="input">
            <h3 className="base--h3">Select a dataset to view output</h3>
            <div className="input--data-selection">
              <RadioGroup
                name="input-name"
                selectedValue={this.state.selectedValue}
                onChange={this.onQueryChange}
              >
                {QUERIES.map((query, i) =>
                  <div className="input--option" key={query.id}>
                    <Radio value={i}>
                      <div className="input--option-icon-container">
                        <QueryIcons className="input--option-icon" type={query.icon} />
                      </div>
                      <div className="input--radio-icon-container">
                        <div className="input--radio-icon" />
                      </div>
                      <p className="base--p input--option-text">{query.text}</p>
                    </Radio>
                  </div>
                )}
              </RadioGroup>
            </div>
          </div>
          <div className="output">

            <div className={`errorMessage ${this.state.error ? '' : 'hidden'}`}>
              <Icon type="error" />
              <p className="base--p">{this.state.error ? this.state.error.error : ''}</p>
            </div>

            <div className={`text-center loading ${this.state.loading ? '' : 'hidden'}`}>
              <Icon type="loader" size="large" />
            </div>

            <div className="output--tabs">
              { !this.state.data ? '' :
              <Tabs selected={0}>
                <Pane key="article" label="Articles">
                  <QueryParams fields={this.state.data.fields} />
                  <div className="query-code-container">
                    <h4 className="base--h4">Query</h4>
                    <pre>
                      {this.state.data.path}
                    </pre>
                  </div>
                  <ArticleList results={this.state.data.raw} />
                </Pane>
                <Pane key="json" label="JSON">
                  <QueryParams fields={this.state.data.fields} />
                  <hr className="base--hr input--hr" />
                  <h4 className="base--h4">JSON Responses</h4>
                  <pre>
                    <code
                      dangerouslySetInnerHTML={{ __html: this.state.data.highlighted || '' }}
                      className="language-json" style={{ whiteSpace: 'pre' }}
                    />
                  </pre>
                </Pane>
              </Tabs>
              }
            </div>
          </div>
        </div>
      </section>
    );
  },
});
