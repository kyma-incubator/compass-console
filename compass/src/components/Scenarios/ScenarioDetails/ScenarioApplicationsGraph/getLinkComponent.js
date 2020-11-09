import {
  LinkHorizontal,
  LinkHorizontalStep,
  LinkHorizontalCurve,
  LinkHorizontalLine,
} from '@visx/shape';

export default function getLinkComponent({ layout, linkType, orientation }) {
  let LinkComponent;

  switch (linkType) {
    case 'step':
      LinkComponent = LinkHorizontalStep;
      break;
    case 'curve':
      LinkComponent = LinkHorizontalCurve;
      break;
    case 'line':
      LinkComponent = LinkHorizontalLine;
      break;
    default:
      LinkComponent = LinkHorizontal;
  }

  return LinkComponent;
}
