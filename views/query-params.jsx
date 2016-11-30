import React from 'react';

function QueryParams(props) {
  return (<div className="query-params">
    <div className="query-params--left">
      {props.fields.map((field, index) =>
        (index >= 0 && index < 3 ? (
          <div className="query-params--field" key={index}>
            <p className="base--p">{field.label}</p>
            <input
              id={field.inputId}
              className="base--input base--text-input"
              type="text"
              value={field.value}
              readOnly
            />
          </div>
        ) : null))}
    </div>
    <div className="query-params--right">
      {props.fields.map((field, index) =>
        (index >= 3 && index < 6 ? (
          <div className="query-params--field" key={index}>
            <p className="base--p">{field.label}</p>
            <input
              id={field.inputId}
              className="base--input base--text-input"
              type="text"
              value={field.value}
              readOnly
            />
          </div>
        ) : null))}
    </div>
  </div>);
}

QueryParams.propTypes = {
  fields: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    inputId: React.PropTypes.string.isRequired,
  }).isRequired),
};

export default QueryParams;
