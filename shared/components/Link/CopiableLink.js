import React from 'react';
import { CopiableText } from '../CopiableText/CopiableText';
import { Link } from './Link';

export const CopiableLink = (props) => (
  <CopiableText textToCopy={props.url} compact>
    <Link {...props} />
  </CopiableText>
);

CopiableLink.propTypes = Link.propTypes;
