import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty, upperFirst } from 'lodash';
import { FocusContainer, TextField, SelectField, Button, CardActions, FontIcon } from 'react-md';
import { toast } from 'react-toastify';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Notification from '../SharedComponents/Notification';
import { addItem } from '../store/items/actions';
import { storeItem } from '../store/item/actions';
import { getFirebaseSnapshot, reassignOwnership } from '../utils/firebase';
import { createItemChannel } from '../utils/mam';
import '../assets/scss/createItemPage.scss';

const PORTS = ['Rotterdam', 'Singapore'];
const CARGO = ['Car', 'Consumer Goods', 'Heavy Machinery', 'Pharma'];
const TYPE = ['Dry storage', 'Refrigerated'];

class CreateItemPage extends Component {
  state = {
    showLoader: false,
    idError: false,
    destinationError: false,
    departureError: false,
    cargoError: false,
    typeError: false,
  };

  componentDidMount() {
    const { user, history } = this.props;
    if (isEmpty(user)) {
      history.push('/login');
    }
  }

  notifySuccess = message => toast.success(message);
  notifyError = message => toast.error(message);

  validate = () => {
    this.setState({
      idError: !this.itemId.value,
      departureError: !this.departure.value,
      destinationError: !this.destination.value,
      cargoError: !this.cargo.value,
      typeError: !this.type.value,
    });

    return (
      !this.itemId.value ||
      !this.departure.value ||
      !this.destination.value ||
      !this.cargo.value ||
      !this.type.value ||
      this.departure.value === this.destination.value
    );
  };

  onError = error => {
    this.setState({ showLoader: false });
    this.notifyError(error || 'Something went wrong');
  };

  createItem = async event => {
    event.preventDefault();
    const formError = this.validate();
    const { history, storeItem, addItem, user, project } = this.props;

    if (!formError) {
      const { id, previousEvent } = user;
      const request = {
        departure: this.departure.value,
        destination: this.destination.value,
        load: this.cargo.value,
        type: this.type.value,
        owner: id,
        status: previousEvent[0],
      };
      // Format the item ID to remove dashes and parens
      const itemId = this.itemId.value.replace(/[^0-9a-zA-Z_-]/g, '');
      const firebaseSnapshot = await getFirebaseSnapshot(itemId, this.onError);
      if (firebaseSnapshot === null) {
        this.setState({ showLoader: true });
        const eventBody = await createItemChannel(project, itemId, request, id);

        await addItem(itemId);
        await storeItem([eventBody]);
        reassignOwnership(project, user, { itemId, status: previousEvent[0] }, false);

        history.push(`/details/${itemId}`);
      } else {
        this.notifyError(`${upperFirst(project.trackingUnit)} exists`);
      }
    } else {
      this.notifyError('Error with some of the input fields');
    }
  };

  render() {
    const {
      showLoader,
      idError,
      departureError,
      destinationError,
      cargoError,
      typeError,
    } = this.state;
    const {
      history,
      project: { trackingUnit },
    } = this.props;

    const unit = upperFirst(trackingUnit);

    const selectFieldProps = {
      dropdownIcon: <FontIcon>expand_more</FontIcon>,
      position: SelectField.Positions.BELOW,
      required: true,
      className: 'md-cell',
      errorText: 'This field is required.',
    };
    return (
      <div>
        <Header>
          <div>
            <div>
              <a onClick={() => history.push('/')}>
                <img src="arrow_left.svg" alt="back" />
              </a>
              <span>Create new {trackingUnit}</span>
            </div>
          </div>
        </Header>
        <div className="createItemWrapper">
          <FocusContainer
            focusOnMount
            containFocus
            component="form"
            className="md-grid"
            onSubmit={this.createItem}
            aria-labelledby="create-item"
          >
            <TextField
              ref={id => (this.itemId = id)}
              id="itemId"
              label={`${unit} ID`}
              required
              type="text"
              error={idError}
              errorText="This field is required."
            />
            <SelectField
              ref={departure => (this.departure = departure)}
              id="departure"
              required
              label="Departure Port"
              className="md-cell"
              menuItems={PORTS}
              position={SelectField.Positions.BELOW}
              error={departureError}
              errorText="This field is required."
              dropdownIcon={<FontIcon>expand_more</FontIcon>}
            />
            <SelectField
              ref={destination => (this.destination = destination)}
              id="destination"
              label="Destination Port"
              menuItems={PORTS}
              error={destinationError}
              {...selectFieldProps}
            />
            <SelectField
              ref={cargo => (this.cargo = cargo)}
              id="cargo"
              label="Cargo"
              menuItems={CARGO}
              error={cargoError}
              {...selectFieldProps}
            />
            <SelectField
              ref={type => (this.type = type)}
              id="type"
              label={`${unit} type`}
              menuItems={TYPE}
              error={typeError}
              {...selectFieldProps}
            />
          </FocusContainer>
          <Notification />
          <div>
            <Loader showLoader={showLoader} />
            <CardActions className={`md-cell md-cell--12 ${showLoader ? 'hidden' : ''}`}>
              <Button raised onClick={this.createItem}>
                Create
              </Button>
            </CardActions>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  project: state.project,
});

const mapDispatchToProps = dispatch => ({
  addItem: itemId => dispatch(addItem(itemId)),
  storeItem: item => dispatch(storeItem(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateItemPage));
