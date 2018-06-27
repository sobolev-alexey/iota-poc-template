import React, { Component } from 'react';
import Autosuggester from 'react-autosuggest';
import { DataTable, TableBody, TableRow, TableColumn } from 'react-md';
import '../../assets/scss/autosuggest.scss';

class Autosuggest extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  getSuggestions = value => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.props.items.filter(item => {
      return (
        regex.test(item.shipper) ||
        regex.test(item.itemId) ||
        regex.test(item.departure) ||
        regex.test(item.destination) ||
        regex.test(item.status)
      );
    });
  };

  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({ suggestions: this.getSuggestions(value) });
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSelect(suggestion);
  };

  getSectionSuggestions = section => [section];

  getSuggestionValue = suggestion => suggestion.itemId;

  renderSuggestion = suggestion => (
    <DataTable plain>
      <TableBody>
        <TableRow key={suggestion.itemId}>
          <TableColumn>{suggestion.itemId}</TableColumn>
          <TableColumn className="md-text-center">
            {suggestion.departure} &rarr; {suggestion.destination}
          </TableColumn>
          <TableColumn className="md-text-right">{suggestion.status}</TableColumn>
        </TableRow>
      </TableBody>
    </DataTable>
  );

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: `Search for ${this.props.trackingUnit}s`,
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggester
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        getSectionSuggestions={this.getSectionSuggestions}
        inputProps={inputProps}
      />
    );
  }
}

export default Autosuggest;
