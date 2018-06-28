import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md';
import { isEmpty, upperFirst } from 'lodash';
import { storeItems } from '../store/items/actions';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Notification from '../SharedComponents/Notification';
import Autosuggest from './Autosuggest';
import '../assets/scss/listPage.scss';

class ListPage extends Component {
  state = {
    showLoader: false,
  };

  componentDidMount() {
    const { project, user, history, items } = this.props;
    if (isEmpty(user) || isEmpty(project)) {
      history.push('/login');
    } else {
      if (isEmpty(items.data)) {
        this.setState({ showLoader: true });
        this.props.storeItems(user);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { items: { data, error } } = nextProps;
    if (error) {
      this.notifyError(error);
    }
    if (!isEmpty(data)) {
      this.setState({ showLoader: false });
    }
  }

  notifyError = message => toast.error(message);

  render() {
    const { project, user, history, items: { data } } = this.props;
    const { showLoader } = this.state;

    if (!project || !project.listPage) return <div />;

    return (
      <div className="App">
        <Header>
          <p>
            Welcome to {project.projectName},<br />
            {user.name}
          </p>
        </Header>
        {user.canCreateStream ? (
          <div className="ctaWrapper">
            <Button raised onClick={() => history.push('/new')}>
              Create new {project.trackingUnit}
            </Button>
          </div>
        ) : null}
        <Loader showLoader={showLoader} />
        <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
          <Autosuggest
            items={data}
            onSelect={item => history.push(`/details/${item.itemId}`)}
            trackingUnit={project.trackingUnit}
          />
          <DataTable plain>
            <TableHeader>
              <TableRow>
                <TableColumn>{upperFirst(project.trackingUnit)} ID</TableColumn>
                <TableColumn className="md-text-center">Route</TableColumn>
                <TableColumn className="md-text-right">Status</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(({ itemId, departure, destination, status }) => (
                <TableRow key={itemId} onClick={() => history.push(`/details/${itemId}`)}>
                  <TableColumn>{itemId}</TableColumn>
                  <TableColumn className="md-text-center">
                    {departure} &rarr; {destination}
                  </TableColumn>
                  <TableColumn className="md-text-right">{status}</TableColumn>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </div>
        <Notification />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.project,
  user: state.user,
  items: state.items,
});

const mapDispatchToProps = dispatch => ({
  storeItems: user => dispatch(storeItems(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
