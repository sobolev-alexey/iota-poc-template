import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md';
import { isEmpty, upperFirst } from 'lodash';
import { storeContainers } from '../store/containers/actions';
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
    const { project, user, history, containers } = this.props;
    if (isEmpty(user) || isEmpty(project)) {
      history.push('/login');
    }
    this.setState({ showLoader: true });
    this.props.storeContainers(user);
    //  else {
    //   if (isEmpty(containers.data)) {
    //     this.setState({ showLoader: true });
    //     this.props.storeContainers(user);
    //   }
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { containers: { data, error } } = nextProps;
    if (error) {
      this.notifyError(error);
    }
    if (!isEmpty(data)) {
      this.setState({ showLoader: false });
    }
  }

  notifyError = message => toast.error(message);

  render() {
    const { project, user, history, containers: { data } } = this.props;
    const { showLoader } = this.state;

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
          <Autosuggest items={data} onSelect={item => history.push(`/details/${item.itemId}`)} />
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
  containers: state.containers,
});

const mapDispatchToProps = dispatch => ({
  storeContainers: user => dispatch(storeContainers(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
