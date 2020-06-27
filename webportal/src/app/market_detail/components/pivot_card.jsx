// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import c from 'classnames';
import {
  Pivot,
  PivotItem,
  FontWeights,
  getTheme,
  Stack,
  Text,
} from 'office-ui-fabric-react';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DataDetail from './data_detail';
import ModelDetail from './model_detail';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

const { spacing, palette } = getTheme();

const Wrapper = styled.div`
  background-color: ${palette.white};
  padding: ${spacing.l2};
  min-height: 700px;
`;

const PivotItemWrapper = styled.div`
  padding: ${spacing.l1};
`;

const PivotCard = props => {
  const { marketItem } = props;

  return (
    <Wrapper>
      <Pivot>
        <PivotItem headerText='Description'>
          <PivotItemWrapper>
            <ReactMarkdown
              className='markdown-body'
              source={marketItem.description}
            />
          </PivotItemWrapper>
        </PivotItem>
        <PivotItem headerText='Detail'>
          <PivotItemWrapper>
            {marketItem.type === 'data' && (
              <DataDetail marketItem={marketItem} />
            )}
            {marketItem.type === 'model' && (
              <ModelDetail marketItem={marketItem} />
            )}
          </PivotItemWrapper>
        </PivotItem>
      </Pivot>
    </Wrapper>
  );
};

PivotCard.propTypes = {
  marketItem: PropTypes.object,
};

export default PivotCard;
