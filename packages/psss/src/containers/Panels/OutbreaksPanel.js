/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { LocationOn, SpeakerNotes, List, MoveToInbox } from '@material-ui/icons';
import {
  CardTabs,
  CardTabList,
  CardTab,
  CardTabPanels,
  Virus,
  WarningCloud,
} from '@tupaia/ui-components';
import {
  Drawer,
  AlertsDrawerHeader,
  AffectedSitesTab,
  ActivityTab,
  NotesTab,
  DrawerTray,
  DropdownMenu,
} from '../../components';
import * as COLORS from '../../constants/colors';
import { countryFlagImage } from '../../utils';
import { connectApi } from '../../api';
import { useFetch } from '../../hooks';

const Option = styled.span`
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }
`;

const menuOptions = [
  {
    value: 'Alert',
    label: (
      <Option>
        <WarningCloud /> Alert
      </Option>
    ),
  },
  {
    value: 'Archive',
    label: (
      <Option>
        <MoveToInbox /> Archive Alert
      </Option>
    ),
  },
  {
    value: 'Outbreak',
    label: (
      <Option>
        <Virus /> Create Outbreak
      </Option>
    ),
  },
];

export const OutbreaksPanelComponent = ({
  isOpen,
  handleClose,
  fetchSitesData,
  fetchNotesData,
  fetchActivityData,
}) => {
  const sitesState = useFetch(fetchSitesData);
  const notesState = useFetch(fetchNotesData);
  const activityState = useFetch(fetchActivityData);

  const handleChange = option => {
    console.log('handle change...', option);
  };

  return (
    <div>
      <Drawer open={isOpen} onClose={handleClose}>
        <DrawerTray
          color={COLORS.RED}
          heading="Outbreak Details"
          onClose={handleClose}
          Icon={Virus}
        />
        <AlertsDrawerHeader
          color={COLORS.RED}
          dateText="Outbreak Start Date:"
          date="Mar 6, 2020"
          avatarUrl={countryFlagImage('as')}
          subheading="American Samoa"
          heading="Measles"
          DropdownMenu={<DropdownMenu options={menuOptions} onChange={handleChange} />}
        />
        <CardTabs>
          <CardTabList>
            <CardTab>
              <LocationOn /> Affected Sites
            </CardTab>
            <CardTab>
              <SpeakerNotes />
              Notes ({notesState.count})
            </CardTab>
            <CardTab>
              <List />
              Activity
            </CardTab>
          </CardTabList>
          <CardTabPanels>
            <AffectedSitesTab type="outbreaks" state={sitesState} />
            <NotesTab state={notesState} />
            <ActivityTab state={activityState} />
          </CardTabPanels>
        </CardTabs>
      </Drawer>
    </div>
  );
};

OutbreaksPanelComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fetchSitesData: PropTypes.func.isRequired,
  fetchNotesData: PropTypes.func.isRequired,
  fetchActivityData: PropTypes.func.isRequired,
};

const mapApiToProps = api => ({
  fetchSitesData: () => api.get('affected-sites'),
  fetchNotesData: () => api.get('messages'),
  fetchActivityData: () => api.get('activity-feed'),
});

export const OutbreaksPanel = connectApi(mapApiToProps)(OutbreaksPanelComponent);
