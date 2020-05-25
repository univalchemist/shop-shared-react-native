import React from 'react';
import { renderForTest } from '@testUtils';
import { TerminatedLabel } from '@screens/Panel';
import messages from '@messages/en-HK';
import { Image } from '@wrappers/components';
import { warningIcon } from '@images';

describe('TerminatedLabel', () => {
  it('should render snapshot correctly', () => {
    const terminatedLabel = renderForTest(<TerminatedLabel />);

    expect(terminatedLabel.toJSON()).toMatchSnapshot();
  });

  it('should render terminated label text', () => {
    const terminatedLabel = renderForTest(<TerminatedLabel />);

    expect(
      terminatedLabel.queryByText(messages['panelSearch.terminated']),
    ).toBeDefined();
  });

  it('should render Warning image', () => {
    const terminatedLabel = renderForTest(<TerminatedLabel />);
    const icon = terminatedLabel.queryByType(Image);

    expect(icon.props.source).toBe(warningIcon);
  });
});
