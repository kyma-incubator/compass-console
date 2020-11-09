import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { Panel } from 'fundamental-react';
import { createEqualityQuery, GET_APPLICATIONS_FOR_SCENARIO } from '../../gql';
import { PageHeader } from 'react-shared';
import ScenarioNameContext from '../ScenarioNameContext';
import useForceUpdate from './useForceUpdate';
import getLinkComponent from './getLinkComponent';

import './ScenarioApplicationsGraph.component.scss';
import { GET_RUNTIMES } from 'components/Runtimes/gql';

ScenarioApplicationsGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.string.isRequired,
};

export default function ScenarioApplicationsGraph({
  width: totalWidth,
  height: totalHeight,
}) {
  const [stepPercent, setStepPercent] = useState(0.5);
  const [layout, setLayout] = useState('cartesian');
  const [orientation, setOrientation] = useState('horizontal');
  const [linkType, setLinkType] = useState('diagonal');

  const [cursor, setCursor] = useState(null);
  const [entries, setEntries] = useState([]);

  const { data: runtimesData, loading: load, error: err } = useQuery(
    GET_RUNTIMES,
    {
      fetchPolicy: 'network-only',
      variables: {
        after: cursor,
      },
      onCompleted: rsp => {
        const { data: newEntries } = rsp.runtimes;
        setEntries(prev => [...prev, ...newEntries]);
      },
    },
  );

  const forceUpdate = useForceUpdate();

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  const scenarioName = useContext(ScenarioNameContext);
  const { data: applicationsForScenario, error, loading } = useQuery(
    GET_APPLICATIONS_FOR_SCENARIO,
    {
      variables: {
        filter: [
          {
            key: 'scenarios',
            query: createEqualityQuery(scenarioName),
          },
        ],
      },
    },
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{`Error! ${error.message}`}</p>;
  }

  const graphData = {
    name: `Entry point\n${runtimesData.runtimes.data[0].name}`,
    children: applicationsForScenario.applications.data.map(application => ({
      name: application.name + application.name + application.name,
      id: application.id,
      children: [],
    })),
  };

  const origin = { x: 0, y: 0 };
  const margin = { top: 30, left: 50, right: 36, bottom: 30 };
  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;
  const sizeWidth = innerHeight;
  const sizeHeight = innerWidth;
  return (
    <>
      <Panel className="fd-has-margin-m">
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title="Graph" />
        </Panel.Header>
        <Panel.Body className="fd-has-padding-none">
          <svg width={innerWidth} height={totalHeight}>
            <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
            <Group top={margin.top} left={margin.left}>
              <Tree
                root={hierarchy(graphData, d =>
                  d.isExpanded ? null : d.children,
                )}
                size={[sizeWidth, sizeWidth]}
                separation={(a, b) =>
                  (a.parent === b.parent ? 1 : 0.5) / a.depth
                }
              >
                {tree => (
                  <Group top={origin.y} left={origin.x}>
                    {tree.links().map((link, i) => (
                      <LinkComponent
                        key={i}
                        data={link}
                        stroke="rgb(254,110,158,0.6)"
                        strokeWidth="1"
                        fill="none"
                      />
                    ))}

                    {tree.descendants().map((node, key) => {
                      let top = node.x;
                      let left = node.y;

                      return (
                        <Group top={top} left={left} key={key}>
                          {node.depth === 0 && (
                            <circle
                              fill="url('#links-gradient')"
                              onClick={() => {
                                node.data.isExpanded = !node.data.isExpanded;
                                console.log(node);
                                forceUpdate();
                              }}
                            />
                          )}

                          <text
                            dy=".33em"
                            fontFamily="Arial"
                            textAnchor="start"
                            style={{ cursor: 'pointer' }}
                            fill="#000"
                            onClick={() => {
                              if (node.depth > 0) {
                                LuigiClient.linkManager()
                                  .fromContext('tenant')
                                  .navigate(
                                    `applications/details/${node.data.id}`,
                                  );
                              }
                            }}
                          >
                            {node.depth > 0 && (
                              <tspan>({node.data.name.split('\n')[0]})</tspan>
                            )}
                            {node.depth === 0 && (
                              <tspan textAnchor="middle" dy="0">
                                ({node.data.name.split('\n')[0]})
                              </tspan>
                            )}
                            {node.depth === 0 && (
                              <tspan textAnchor="middle" dy="16px" x="0px">
                                ({node.data.name.split('\n')[1]})
                              </tspan>
                            )}
                          </text>
                        </Group>
                      );
                    })}
                  </Group>
                )}
              </Tree>
            </Group>
          </svg>
        </Panel.Body>
      </Panel>
    </>
  );
}
