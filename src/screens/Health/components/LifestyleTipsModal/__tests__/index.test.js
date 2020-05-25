import React from 'react';
import LifestyleTipsModal from '../index';
import { LifestyleTipLayout } from '../LifestyleTipLayout';
import { PromiseStatus } from 'middlewares';
import { LifestyleTipLoader } from '../LifestyleTipLoader';
import { ErrorPanel } from '@wrappers/components';
import { render, renderForTest } from '@testUtils';

const tips = {};
const lifestyleTips = {
  bmi: [
    {
      text: 'text',
      topic: 'topic 1',
      source: 'source 1',
    },
    {
      text: 'text',
      topic: 'topic 2',
      source: 'source 2',
    },
  ],
};

describe('LifestyleTipsModal', () => {
  it('should render snapshot', () => {
    const [component] = render(
      <LifestyleTipsModal route={{ params: { tips } }} />,
      {
        initialState: {
          health: {
            lifestyleTips: {
              tips: lifestyleTips,
              status: PromiseStatus.SUCCESS,
            },
          },
        },
      },
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render LifestyleTipLayout if lifestyleTips fetching is successful', () => {
    const lifestyleTips = {
      bmi: [
        {
          text: 'text',
          topic: 'topic 1',
          source: 'source 1',
        },
        {
          text: 'text',
          topic: 'topic 2',
          source: 'source 2',
        },
      ],
    };
    const component = renderForTest(
      <LifestyleTipsModal route={{ params: { tips } }} />,
      {
        initialState: {
          health: {
            lifestyleTips: {
              tips: lifestyleTips,
              status: PromiseStatus.SUCCESS,
            },
          },
        },
      },
    );
    expect(component.queryAllByType(LifestyleTipLayout).length).toBe(1);
  });

  it('should render LifestyleTipLayoutError if lifestyleTips fetching is error', () => {
    const component = renderForTest(
      <LifestyleTipsModal route={{ params: { tips } }} />,
      {
        initialState: {
          health: {
            lifestyleTips: {
              tips: undefined,
              status: PromiseStatus.ERROR,
            },
          },
        },
      },
    );
    expect(component.queryAllByType(ErrorPanel).length).toBe(1);
  });

  it('should render LifestyleTipLayoutLoader if lifestyleTips fetching is in progress', () => {
    const component = renderForTest(
      <LifestyleTipsModal route={{ params: { tips } }} />,
      {
        initialState: {
          health: {
            lifestyleTips: {
              tips: undefined,
              status: PromiseStatus.START,
            },
          },
        },
      },
    );
    expect(component.queryAllByType(LifestyleTipLoader).length).toBe(1);
  });
});
