import LuigiClient from '@luigi-project/client';

export default async function unassignFormationHandler(
  unassignFormationMutation,
  scenarioName,
  objectID,
  successCallback,
) {
  const showConfirmation = () =>
    LuigiClient.uxManager().showConfirmationModal({
      header: 'Delete scenario assignment',
      body: `Are you sure you want to delete the automatic scenario assignment for "${scenarioName}"?`,
      buttonConfirm: 'Confirm',
      buttonDismiss: 'Cancel',
    });

  const tryUnassignFormation = async () => {
    try {
      await unassignFormationMutation(scenarioName, objectID);

      if (successCallback) {
        successCallback();
      }
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  };

  showConfirmation()
    .then(tryUnassignFormation)
    .catch(() => {});
}
