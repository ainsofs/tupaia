/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import Typography from '@material-ui/core/Typography';
import {
  EditableTableProvider,
  ButtonSelect,
  Card,
  ErrorAlert,
  LightErrorAlert,
  Button,
  LightPrimaryButton,
} from '@tupaia/ui-components';
import {
  SiteAddress,
  Drawer,
  DrawerFooter,
  DrawerTray,
  DrawerHeader,
  PercentageChangeCell,
  AlertCreatedModal,
} from '../../components';
import {
  getSitesForWeek,
  getActiveWeekCountryData,
  closeWeeklyReportsPanel,
  checkWeeklyReportsPanelIsOpen,
  checkWeeklyReportAreVerified,
  confirmWeeklyReportsData,
} from '../../store';
import * as COLORS from '../../constants/colors';
import { CountryReportTable, SiteReportTable } from '../Tables';
import { countryFlagImage } from '../../utils';

const columns = [
  {
    title: 'Syndromes',
    key: 'title',
    sortable: false,
  },
  {
    title: '',
    key: 'percentageChange',
    CellComponent: PercentageChangeCell,
    sortable: false,
    width: '80px',
  },
  {
    title: 'Total Cases',
    key: 'totalCases',
    editable: true,
    sortable: false,
    width: '80px',
  },
];

const MainSection = styled.section`
  position: relative;
  padding: 30px 20px;

  &:after {
    display: ${props => (props.disabled ? 'block' : 'none')};
    position: absolute;
    content: '';
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    opacity: 0.5;
  }
`;

const GreySection = styled(MainSection)`
  background: ${COLORS.LIGHTGREY};
  box-shadow: 0 1px 0 ${COLORS.GREY_DE};
  padding: 25px 20px;
`;

const HelperText = styled(Typography)`
  margin-top: 1rem;
  font-size: 0.8125rem;
  line-height: 0.9375rem;
  color: ${COLORS.TEXT_MIDGREY};
`;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    padding-bottom: 125px;
  }
`;

const FooterInner = styled.div`
  padding: 1.5rem;
`;

const TABLE_STATUSES = {
  STATIC: 'static',
  SAVING: 'saving',
};

const PANEL_STATUSES = {
  INITIAL: 'initial',
  SUBMIT_ATTEMPTED: 'submitAttempted',
  SUCCESS: 'success',
};

export const WeeklyReportsPanelComponent = React.memo(
  ({ countryData, sitesData, isOpen, handleClose, isVerified, handleConfirm }) => {
    const [panelStatus, setPanelStatus] = useState(PANEL_STATUSES.INITIAL);
    const [countryTableStatus, setCountryTableStatus] = useState(TABLE_STATUSES.STATIC);
    const [sitesTableStatus, setSitesTableStatus] = useState(TABLE_STATUSES.STATIC);
    const [activeSiteIndex, setActiveSiteIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = () => {
      if (isVerified) {
        handleConfirm();
        setIsModalOpen(true);
        setPanelStatus(PANEL_STATUSES.SUCCESS);
      } else {
        setPanelStatus(PANEL_STATUSES.SUBMIT_ATTEMPTED);
      }
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    if (countryData.length === 0 || sitesData.length === 0) {
      return null;
    }

    const activeSite = sitesData[activeSiteIndex];
    const { syndromes: syndromesData } = activeSite;
    const isSaving =
      countryTableStatus === TABLE_STATUSES.SAVING || sitesTableStatus === TABLE_STATUSES.SAVING;
    const showVerifyMessage = panelStatus === PANEL_STATUSES.SUBMIT_ATTEMPTED && !isVerified;

    return (
      <StyledDrawer open={isOpen} onClose={handleClose}>
        <DrawerTray heading="Upcoming report" onClose={handleClose} />
        <DrawerHeader
          trayHeading="Upcoming report"
          heading="American Samoa"
          date="Week 9 Feb 25 - Mar 1, 2020"
          avatarUrl={countryFlagImage('as')}
        />
        <LightErrorAlert>ILI Above Threshold. Please review and verify data.</LightErrorAlert>
        <GreySection disabled={isSaving} data-testid="country-reports">
          <EditableTableProvider
            columns={columns}
            data={countryData}
            tableStatus={countryTableStatus}
          >
            <CountryReportTable
              tableStatus={countryTableStatus}
              setTableStatus={setCountryTableStatus}
            />
          </EditableTableProvider>
        </GreySection>
        <MainSection disabled={isSaving} data-testid="site-reports">
          <ButtonSelect
            id="active-site"
            options={sitesData}
            onChange={setActiveSiteIndex}
            index={activeSiteIndex}
          />
          <SiteAddress address={activeSite.address} contact={activeSite.contact} />
          <Card variant="outlined" mb={3}>
            <EditableTableProvider
              columns={columns}
              data={syndromesData}
              tableStatus={sitesTableStatus}
            >
              <SiteReportTable
                tableStatus={sitesTableStatus}
                setTableStatus={setSitesTableStatus}
              />
            </EditableTableProvider>
          </Card>
        </MainSection>
        <DrawerFooter disabled={isSaving}>
          {showVerifyMessage && (
            <ErrorAlert>ILI Above Threshold. Please review and verify data.</ErrorAlert>
          )}
          <FooterInner>
            {panelStatus === PANEL_STATUSES.SUCCESS ? (
              <LightPrimaryButton disabled fullWidth>
                <CheckCircleIcon /> Confirmed
              </LightPrimaryButton>
            ) : (
              <>
                <Button fullWidth onClick={handleSubmit}>
                  Submit now
                </Button>
                <HelperText>Verify data to submit Weekly Report to Regional</HelperText>
              </>
            )}
          </FooterInner>
        </DrawerFooter>
        <AlertCreatedModal isOpen={isModalOpen} handleClose={handleCloseModal} />
      </StyledDrawer>
    );
  },
);

WeeklyReportsPanelComponent.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
  countryData: PropTypes.array.isRequired,
  sitesData: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isVerified: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isOpen: checkWeeklyReportsPanelIsOpen(state),
  countryData: getActiveWeekCountryData(state),
  sitesData: getSitesForWeek(state),
  isVerified: checkWeeklyReportAreVerified(state),
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(closeWeeklyReportsPanel()),
  handleConfirm: () => dispatch(confirmWeeklyReportsData()),
});

export const WeeklyReportsPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WeeklyReportsPanelComponent);
