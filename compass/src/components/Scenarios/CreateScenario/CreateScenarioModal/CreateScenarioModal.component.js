import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { Button } from '@kyma-project/react-components';
import { Modal, CREDENTIAL_TYPE_OAUTH } from 'react-shared';

import CreateScenarioCredentials from '../CreateScenarioCredentials/CreateScenarioCredentials.container';
import CreateScenarioForm from './../CreateScenarioForm/CreateScenarioForm.container';

const onPremIds = ['b119e9c4-1cbc-4f36-abac-4ab70d7a743e'];

export default class CreateScenarioModal extends React.Component {
  state = {
    name: '',
    nameError: '',
    credentialsError: '',
    applicationsToAssign: [],
    runtimesToAssign: [],
    page: 1,
  };

  applicationsWithCredentials = [];
  components = [];

  checkScenarioAlreadyExists = (scenarioName) => {
    const scenariosQuery = this.props.scenariosQuery;
    return (
      !!scenariosQuery.error ||
      (scenariosQuery.labelDefinition &&
        JSON.parse(scenariosQuery.labelDefinition.schema).items.enum.includes(
          scenarioName,
        ))
    );
  };

  componentDidMount() {
    this.components = this.setupComponents();
  }

  updateScenarioName = (e) => {
    const nameRegex = /^[A-Za-z0-9]([-_A-Za-z0-9\s]*[A-Za-z0-9])$/;
    const scenarioName = e.target.value;
    this.setState({ name: scenarioName });

    if (this.checkScenarioAlreadyExists(scenarioName)) {
      this.setState({
        nameError: 'Scenario with this name already exists.',
      });
    } else if (!nameRegex.test(scenarioName)) {
      this.setState({
        nameError:
          'The scenario name can only contain lowercase alphanumeric characters or dashes',
      });
    } else {
      this.setState({ nameError: '' });
    }
  };

  updateCredentials = (e) => {
    this.setState({
      credentialsError: e,
    });
  };

  setCredentialsType = (type) => {
    this.setState({
      credentialsType: type,
    });
  };

  updateApplications = (assignedApplications) => {
    this.setState({ applicationsToAssign: assignedApplications }, () => {
      this.applicationsWithCredentials = this.state.applicationsToAssign.filter(
        (application) => onPremIds.includes(application.applicationTemplateID),
      );
      this.components = this.setupComponents();
      this.forceUpdate();
    });
  };

  updateRuntimes = (assignedRuntimes) => {
    this.setState({ runtimesToAssign: assignedRuntimes });
  };

  disabledConfirm = () => {
    const { name, nameError, credentialsError } = this.state;
    return !name.trim() || !!nameError || !!credentialsError;
  };

  addScenarioAndAssignEntries = async () => {
    try {
      await this.addScenario();
      await this.assignEntries();
    } catch (e) {
      console.warn(e);
      this.showError(e);
    }
  };

  addScenario = async () => {
    const { scenariosQuery, createScenarios, addScenario } = this.props;
    const scenarioName = this.state.name;

    if (scenariosQuery.error) {
      await createScenarios([scenarioName]);
    } else {
      const currentScenarios = JSON.parse(scenariosQuery.labelDefinition.schema)
        .items.enum;
      await addScenario(currentScenarios, scenarioName);
    }
    scenariosQuery.refetch();
  };

  assignEntries = async () => {
    const { setApplicationScenarios, setRuntimeScenarios } = this.props;
    const {
      name: scenarioName,
      applicationsToAssign,
      runtimesToAssign,
    } = this.state;
    const applicationUpdates = applicationsToAssign.map((application) => {
      const labels = application.labels.scenarios || [];
      return setApplicationScenarios(application.id, [...labels, scenarioName]);
    });
    const runtimeUpdates = runtimesToAssign.map((runtime) => {
      const labels = runtime.labels.scenarios || [];
      return setRuntimeScenarios(runtime.id, [...labels, scenarioName]);
    });

    const result = await Promise.allSettled([
      ...applicationUpdates,
      ...runtimeUpdates,
    ]);

    const rejected = result.filter((r) => r.status === 'rejected');
    if (rejected.length) {
      this.showWarningNotification(
        scenarioName,
        rejected.length,
        result.length,
      );
    } else {
      this.showSuccessNotification(scenarioName);
    }
  };

  showError(error) {
    LuigiClient.uxManager().showAlert({
      text: error.message,
      type: 'error',
      closeAfter: 10000,
    });
  }

  showSuccessNotification = (scenarioName) => {
    this.props.sendNotification({
      variables: {
        content: `Created scenario ${scenarioName}.`,
        title: `${scenarioName}`,
        color: '#359c46',
        icon: 'accept',
        instanceName: scenarioName,
      },
    });
  };

  showWarningNotification = (scenarioName, rejected, all) => {
    const succeeded = all - rejected;
    this.props.sendNotification({
      variables: {
        content: `Scenario created and assigned to ${succeeded}/${all} entries.`,
        title: `${scenarioName}`,
        color: '#d08014',
        icon: 'warning',
        instanceName: scenarioName,
      },
    });
  };

  onClickPrev = () => {
    this.setState({ page: this.state.page - 1 });
  };

  onClickNext = () => {
    this.setState({ page: this.state.page + 1 });
  };

  isConfirmationHidden = (components) => {
    return this.state.page !== components.length;
  };

  setupComponents = () => {
    return [
      <CreateScenarioForm
        updateScenarioName={this.updateScenarioName}
        nameError={this.state.nameError}
        updateApplications={this.updateApplications}
        applicationsToAssign={this.state.applicationsToAssign}
        updateRuntimes={this.updateRuntimes}
        runtimesToAssign={this.state.runtimesToAssign}
      />,
      ...this.applicationsWithCredentials.map((application, idx) => (
        <CreateScenarioCredentials
          applicationToAssign={application}
          applicationTemplates={this.props.applicationTemplates}
          updateCredentialsError={this.updateCredentials}
        />
      )),
    ];
  };

  render() {
    const loading =
      this.props.applicationTemplates &&
      this.props.applicationTemplates.loading;
    const error =
      this.props.applicationTemplates && this.props.applicationTemplates.error;

    if (loading) {
      return 'Loading...';
    }
    if (error) {
      return `Error! ${error.message}`;
    }

    const modalOpeningComponent = (
      <Button option="light">Create Scenario</Button>
    );

    return (
      <Modal
        title="Create scenario"
        confirmText="Save"
        cancelText="Close"
        additionalButtonsText={['Prev', 'Next']}
        onAdditionalButtons={[
          this.onClickPrev.bind(this),
          this.onClickNext.bind(this),
        ]}
        areAdditionalButtonDisabled={[
          this.state.page === 1,
          this.state.page === this.components.length,
        ]}
        type={'emphasized'}
        isConfirmHidden={this.isConfirmationHidden(this.components)}
        disabledConfirm={this.disabledConfirm()}
        modalOpeningComponent={modalOpeningComponent}
        onConfirm={this.addScenarioAndAssignEntries}
      >
        <div>
          {React.cloneElement(this.components[this.state.page - 1], {
            nameValue: this.state.name,
          })}
        </div>
      </Modal>
    );
  }
}

CreateScenarioModal.propTypes = {
  scenariosQuery: PropTypes.object.isRequired,
  createScenarios: PropTypes.func.isRequired,
  addScenario: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
  applicationTemplates: PropTypes.object.isRequired,

  setRuntimeScenarios: PropTypes.func.isRequired,
  setApplicationScenarios: PropTypes.func.isRequired,
};
