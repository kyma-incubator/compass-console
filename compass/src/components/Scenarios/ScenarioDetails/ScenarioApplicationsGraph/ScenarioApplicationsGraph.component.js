import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { Panel } from 'fundamental-react';

import { createEqualityQuery, GET_APPLICATIONS_FOR_SCENARIO } from '../../gql';
import ScenarioNameContext from '../ScenarioNameContext';
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
  const layout = 'cartesian';
  const orientation = 'horizontal';
  const linkType = 'diagonal';

  const [cursor] = useState(null);
  const [, setEntries] = useState([]);

  const {
    data: runtimesData,
    loading: runtimesLoading,
    error: runtimesError,
  } = useQuery(GET_RUNTIMES, {
    fetchPolicy: 'network-only',
    variables: {
      after: cursor,
    },
    onCompleted: rsp => {
      const { data: newEntries } = rsp.runtimes;
      setEntries(prev => [...prev, ...newEntries]);
    },
  });

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  const scenarioName = useContext(ScenarioNameContext);
  const {
    data: applicationsForScenario,
    error: applicationsError,
    loading: applicationsLoading,
  } = useQuery(GET_APPLICATIONS_FOR_SCENARIO, {
    variables: {
      filter: [
        {
          key: 'scenarios',
          query: createEqualityQuery(scenarioName),
        },
      ],
    },
  });

  if (
    applicationsLoading ||
    runtimesLoading ||
    !applicationsForScenario.applications
  ) {
    return <p>Loading...</p>;
  }

  if (applicationsError) {
    return <p>{`Error! ${applicationsError.message}`}</p>;
  }

  if (runtimesError) {
    return <p>{`Error! ${runtimesError.message}`}</p>;
  }

  const graphData = {
    name: `Entry point\n${runtimesData.runtimes.data[0].name}`,
    children: applicationsForScenario.applications.data.map(application => ({
      name: application.name,
      id: application.id,
      children: [],
    })),
  };

  const origin = { x: 0, y: 0 };
  const margin = { top: 30, left: 72, right: 36, bottom: 30 };
  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;
  const sizeWidth = innerHeight;
  return (
    <>
      <Panel className="fd-has-margin-m">
        <Panel.Header className="fd-has-padding-xs">
          <Panel.Head title="Scenario visualization" />
        </Panel.Header>
        <Panel.Body className="fd-has-padding-none">
          <svg width={innerWidth} height="400" viewBox="0 0 800 400">
            <defs>
              <marker
                id="arrow"
                viewBox="0 -5 10 10"
                refX="15"
                refY="-.5"
                markerWidth="10"
                markerHeight="25"
                orient="auto"
                fill="rgb(254,110,158,1)"
              >
                <path d="M0,-5L10,0L0,5" />
              </marker>
            </defs>
            <defs>
              <filter id="shadow" width="150%" height="150%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="4" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <text class="graph--text-type" textAnchor="end" x="95%" y="30">
              Virtual mesh
            </text>

            <rect
              width="100%"
              height="98%"
              transform="translate(0,5)"
              fill="none"
              stroke="#000"
              strokeDasharray="5,5"
              strokeWidth="2"
            />
            <Group left={margin.left} top={margin.top}>
              <Tree
                root={hierarchy(graphData)}
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
                        markerEnd="url(#arrow)"
                      />
                    ))}
                    {tree.descendants().map((node, key) => {
                      let top = node.x;
                      let left = node.y;
                      const width = 40;
                      return (
                        <Group top={top} left={left} key={key}>
                          {node.depth === 0 && (
                            <circle
                              r={20}
                              filter="url(#shadow)"
                              fill="#466ab0"
                            />
                          )}
                          {node.depth !== 0 && (
                            <rect
                              height={width}
                              width={width}
                              y="-20"
                              x={-width / 6}
                              fill="#466ab0"
                              rx="10"
                              filter="url(#shadow)"
                            />
                          )}
                          <text
                            y="35"
                            x="5"
                            fontFamily="Arial"
                            textAnchor="middle"
                            style={{ cursor: 'pointer' }}
                            fill="#000"
                            dominantBaseline="middle"
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
                              <tspan
                                y="0"
                                x="40"
                                dominantBaseline="middle"
                                textAnchor="start"
                              >
                                {node.data.name.split('\n')[0]}
                              </tspan>
                            )}
                            {node.depth === 0 && (
                              <tspan
                                dominantBaseline="middle"
                                textAnchor="middle"
                                dy="0"
                              >
                                {node.data.name.split('\n')[0]}
                              </tspan>
                            )}
                            {node.depth === 0 && (
                              <tspan
                                dominantBaseline="middle"
                                textAnchor="middle"
                                dy="16px"
                                x="0px"
                              >
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
