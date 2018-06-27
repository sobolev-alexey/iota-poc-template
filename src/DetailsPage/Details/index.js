import React from 'react';
import * as moment from 'moment';
import '../../assets/scss/details.scss';

const Details = ({ item }) => {
  const updated = item ? moment.duration(Date.now() - item.timestamp).humanize() : '';

  return (
    <div className="detailSectionWrapper">
      <div className="detailsSection">
        <span className="label">Owner</span>
        <span className="value">{item.owner}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Item ID</span>
        <span className="value">{item.itemId}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Status</span>
        <span className="value">{item.status}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Load</span>
        <span className="value">{item.load}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Type</span>
        <span className="value">{item.type}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Updated</span>
        <span className="value">{updated} ago</span>
      </div>
    </div>
  );
};

export default Details;
