export const getBadgeTypeForStatus = (status) => {
  if (!status) {
    return undefined;
  }

  switch (status.condition) {
    case 'INITIAL':
      return 'info';
    case 'CONNECTED':
      return 'success';
    case 'UNPAIRING':
    case 'CREATING':
    case 'DELETING':
    case 'UPDATING':
      return 'warning';
    case 'FAILED':
    case 'DELETE_FAILED':
    case 'UNPAIR_FAILED':
    case 'CREATE_FAILED':
    case 'UPDATE_FAILED':
      return 'error';
    default:
      return undefined;
  }
};
