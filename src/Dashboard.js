import { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import StatisticsSection from './shared/StatisticsSection.js';
import RankingSection from './shared/RankingSection.js';
import ActivityProgressSection from './shared/ActivityProgressSection.js';
import CaseTypeSection from './shared/CaseTypeSection.js';
import SimpleHeaderSection from './shared/SimpleHeaderSection.js';
import AchievementSection from './shared/AchievementSection.js';
import ReactTooltip from 'react-tooltip';

import './Dashboard.css';
import Modal from 'react-modal';
import { getDB } from './db';
import getUserStats from './shared/getUserStats';
import version from './version.js';
import sha from './sha.js';
import getUsername from './viewer/lib/getUsername.js';
import annotatorCollectionStatus from './case/annotatorCollectionStatus.js';

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

    collectionsDB
      .find({
        selector: {
          Enabled: true
        }
      })
      .then(async result => {
        const { docs } = result;
        const typePromises = docs.map(async collection => {
          const annotatorID = getUsername();
          // TODO: Why can't we do this in one call instead of >10
          const status = await annotatorCollectionStatus(
            collection.Collection,
            annotatorID
          );
          const host = ''; // 'https://db.crowds-cure.org';
          const db = 'screenshots'; // 'collections';
          const name = collection.Collection.replace(/\s+/g, '-') + '.jpg'; // 'screenshot.png';

          //const img = `${host}/${db}/${row.id}/${name}`;
          const img = `${host}/${db}/${name}`;

          return {
            ...collection,
            inCollection: status.inCollection,
            byAnnotator: status.byAnnotator,
            img
          };
        });

        const types = await Promise.all(typePromises);
        const enabledTypes = types.filter(type => {
          return type !== null;
        });

        enabledTypes.sort((a, b) => {
          const aOrder = a.Order;
          const bOrder = b.Order;
          if (aOrder === undefined && bOrder === undefined) {
            return 0;
          } else if (aOrder === undefined) {
            return 1;
          } else if (bOrder === undefined) {
            return -1;
          }

          return a.Order - b.Order;
        });

        const totalCompleteCollection = enabledTypes.reduce(
          (acc, val) => (val.byAnnotator === val.inCollection ? acc + 1 : acc),
          0
        );

        this.props.setTotalCompleteCollection(totalCompleteCollection);

        this.setState({
          types: enabledTypes,
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
    const versionString = `${version} - ${sha}`;

    return (
      <div className="Dashboard">
        <SimpleHeaderSection username={this.props.username} page="dashboard" />
        <div className="container">
          <div className="row">
            <div className="col-lg-5 offset-lg-4 col-md-7 offset-md-2 col-12 offset-4 order-1">
              <ActivityProgressSection current={this.state.current} />
            </div>

            <div className="col-lg-3 offset-lg-3 col-md-7 col-16 order-3 order-lg-2">
              <AchievementSection />
            </div>

            <div className="col-16 order-2 order-lg-3">
              <div className="row">
                <div className="col-lg-4 col-md-16 order-2 order-lg-1">
                  <div className="row">
                    <div className="col-lg-16 col-md-8 col-sm-16">
                      <StatisticsSection col="8" />
                    </div>
                    <div className="col-lg-16 col-md-8 col-sm-16">
                      <div className="row rankingGroupSection">
                        <div className="col-16">
                          <RankingSection
                            name="Top individuals"
                            type="individual"
                            viewAllLink="/leaderboard"
                          />
                        </div>
                        <div className="col-16">
                          <RankingSection name="Top groups" type="team" />
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
        <ReactTooltip className="DashboardTooltip" effect="solid" />
        <p className="hidden-version-text">{versionString}</p>
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
          <a target="_blank" rel="noopener noreferrer" href={item.Link}>
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
