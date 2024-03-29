import React from 'react';
import PropTypes from 'prop-types';
import { Counter } from 'fundamental-react/Badge';
import LuigiClient from '@luigi-project/client';
import { Popover, Menu, Button } from 'fundamental-react';

import {
  StatusBadge,
  GenericList,
  handleDelete,
  PageHeader,
  EMPTY_TEXT_PLACEHOLDER,
} from 'react-shared';
import CreateApplicationModal from './CreateApplicationModal/CreateApplicationModal.container';
import CreateApplicationFromTemplateModal from './CreateApplicationFromTemplateModal/CreateApplicationFromTemplateModal';
import ScenariosDisplay from './../Shared/ScenariosDisplay/ScenariosDisplay';
import { getBadgeTypeForStatus } from './../Shared/getBadgeTypeForStatus';

import './Applications.scss';

const DISCOVERY_SAP_MANAGED = 'SAP Managed';
const DISCOVERY_CUSTOMER_MANAGED = 'Customer Managed';

class Applications extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    deleteApplication: PropTypes.func.isRequired,
  };

  headerRenderer = (applications) => [
    'Name',
    'Description',
    'URL',
    'Discovery',
    'Scenarios',
    'Packages',
    'Status',
  ];

  rowRenderer = (application) => {
    const managedLabel = application.labels && application.labels.managed;
    let managedState;
    try {
      managedState = JSON.parse(managedLabel.toLowerCase())
        ? DISCOVERY_SAP_MANAGED
        : DISCOVERY_CUSTOMER_MANAGED;
    } catch {
      managedState = DISCOVERY_CUSTOMER_MANAGED;
    }

    return [
      <span
        className="link"
        onClick={() =>
          LuigiClient.linkManager().navigate(`details/${application.id}`)
        }
      >
        {application.name}
      </span>,
      application.description
        ? application.description
        : EMPTY_TEXT_PLACEHOLDER,
      application.baseUrl ? application.baseUrl : EMPTY_TEXT_PLACEHOLDER,
      managedState,
      <ScenariosDisplay
        scenarios={(application.labels && application.labels.scenarios) || []}
      />,
      <Counter>{application.packages.totalCount}</Counter>,
      <StatusBadge type={getBadgeTypeForStatus(application.status)}>
        {application.status && application.status.condition
          ? application.status.condition
          : 'UNKNOWN'}
      </StatusBadge>,
    ];
  };

  actions = [
    {
      name: 'Delete',
      handler: (entry) => {
        handleDelete(
          'Application',
          entry.id,
          entry.name,
          this.props.deleteApplication,
          this.props.applications.refetch,
        );
      },
    },
  ];

  render() {
    const applicationsQuery = this.props.applications;

    const applications =
      (applicationsQuery &&
        applicationsQuery.applications &&
        applicationsQuery.applications.data) ||
      {};
    const loading = applicationsQuery && applicationsQuery.loading;
    const error = applicationsQuery && applicationsQuery.error;

    if (loading) {
      return 'Loading...';
    }
    if (error) {
      return `Error! ${error.message}`;
    }

    const extraHeaderContent = (
      <Popover
        body={
          <Menu>
            <Menu.List>
              <CreateApplicationModal
                applicationsQuery={applicationsQuery}
                modalOpeningComponent={<Menu.Item>From scratch</Menu.Item>}
              />
              <CreateApplicationFromTemplateModal
                applicationsQuery={applicationsQuery}
                modalOpeningComponent={<Menu.Item>From template</Menu.Item>}
              />
            </Menu.List>
          </Menu>
        }
        control={<Button option="light">Create application...</Button>}
        widthSizingType="matchTarget"
        placement="bottom-end"
      />
    );

    return (
      <>
        <PageHeader title="Applications" />
        <GenericList
          extraHeaderContent={extraHeaderContent}
          actions={this.actions}
          entries={applications}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
        />
      </>
    );
  }
}

export default Applications;
