import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ActivityProgressSection from './shared/ActivityProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
import SimpleHeaderSection from './shared/SimpleHeaderSection.js';
//import AchievementSection from './shared/AchievementSection.js';

import './Dashboard.css';
import Modal from 'react-modal';
import { getDB } from './db';
import getUserStats from './shared/getUserStats';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: [],
      current: this.props.current,
      isLoading: true,
      showDetailsModal: false,
      collectionDescription: ''
    };

    const collectionsDB = getDB('collections');

    collectionsDB.allDocs({ include_docs: true }).then(docs => {
      const types = docs.rows.map(row => row.doc);

      this.setState({
        types,
        isLoading: false
      });
    });

    getUserStats().then(userStats => {
      this.context.store.dispatch({
        type: 'SET_FROM_DATABASE',
        savedState: {
          current: userStats.current
        }
      });

      this.setState({
        current: userStats.current
      });
    });

    this.onClickInfo = this.onClickInfo.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  render() {
    return (
      <div className="Dashboard">
        <SimpleHeaderSection username={this.props.username} page="dashboard" />
        <div className="container">
          <div className="row">
            <div className="col-lg-5 offset-lg-4 col-md-7 offset-md-2">
              <ActivityProgressSection current={this.state.current} />
              {/*<AchievementSection />*/}
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-16 order-2 order-lg-1">
                <div className="row">
                  <div className="col-lg-16 col-md-8 col-sm-16">
                    <StatisticsSection col="8" />
                  </div>
                  <div className="col-lg-16 col-md-8 col-sm-16">
                    <div className="row">
                      <div className="col-16">
                        <RankingSection name="Close to you" />
                      </div>
                      <div className="col-16">
                        <RankingSection name="Top this week" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-16 col-sm-16 order-1 order-lg-2">
                <div className="row">
                  <div className="col-16">
                    <CaseTypeSection
                      types={this.state.types}
                      isLoading={this.state.isLoading}
                      onClickInfo={this.onClickInfo}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.showDetailsModal}
          contentLabel="Dataset Details"
          onRequestClose={this.toggleModal}
          styles={customStyles}
          className="Modal"
          overlayClassName="Overlay"
          closeTimeoutMS={200}
        >
          {this.state.collectionDescription}
          <span className="modal-close" onClick={this.toggleModal}>
            Close
          </span>
        </Modal>
      </div>
    );
  }

  toggleModal() {
    this.setState({
      showDetailsModal: !this.state.showDetailsModal
    });
  }

  onClickInfo(event, item) {
    event.preventDefault();
    event.stopPropagation();

    const collectionDescription = (
      <>
        <h1>Collection: {item.Collection}</h1>
        <h2>Type: {item.Type}</h2>
        <h3>Location: {item.Location}</h3>
        <p>{item.Description}</p>
        <span>
          Dataset available at:{' '}
          <a target="_blank" href={item.Link}>
            {item.Link}
          </a>
        </span>
      </>
    );

    this.setState({ collectionDescription, showDetailsModal: true });
  }

  logout() {
    window.auth.logout();
  }
}

Dashboard.contextTypes = {
  store: PropTypes.object.isRequired
};

Dashboard.propTypes = {
  current: PropTypes.number,
  username: PropTypes.string.isRequired
};

export default Dashboard;
