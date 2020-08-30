/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import MuiButton from '@material-ui/core/Button';
import MuiAvatar from '@material-ui/core/Avatar';
import Popper from '@material-ui/core/Popper';
import MuiList from '@material-ui/core/List';
import MuiListItem from '@material-ui/core/ListItem';
import { FlexStart } from './Layout';

const StyledListItem = styled(MuiListItem)`
  font-size: 0.875rem;
  line-height: 1rem;
  padding: 0.5rem 1.25rem;
  color: ${props => props.theme.palette.text.secondary};

  &:hover {
    color: ${props => props.theme.palette.text.primary};
    background: none;
  }
`;

export const ProfileButtonItem = ({ button, ...props }) => (
  <StyledListItem button={button} component={button ? null : RouterLink} {...props} />
);

ProfileButtonItem.propTypes = {
  button: PropTypes.bool,
};

ProfileButtonItem.defaultProps = {
  button: false,
};

const Paper = styled.div`
  background: white;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-top: 0.3rem;
  min-width: 13rem;
`;

const Avatar = styled(MuiAvatar)`
  color: white;
  background: ${props => props.theme.palette.success.main};
  font-weight: 600;
`;

const Header = styled(FlexStart)`
  align-items: flex-end;
  padding: 1.125rem 0 0.75rem;
  margin: 0 1.25rem 0.2rem 1.25rem;
  border-bottom: 1px solid ${props => props.theme.palette.grey['400']};
`;

const Details = styled.div`
  padding-left: 0.5rem;
  padding-right: 0.3rem;
`;

const NameText = styled.div`
  font-size: 1rem;
  line-height: 1.2rem;
  margin-bottom: 0.3rem;
  color: ${props => props.theme.palette.text.secondary};
`;

const EmailText = styled.div`
  font-size: 0.8rem;
  line-height: 0.9rem;
  letter-spacing: -0.01em;
  color: ${props => props.theme.palette.text.tertiary};
`;

const StyledButton = styled(MuiButton)`
  color: white;
  background: ${props => props.theme.palette.secondary.main};
  border-radius: 3.25rem;
  padding: 0.25rem 0.75rem 0.3rem 0.8rem;
  font-weight: 400;
  letter-spacing: 0;

  &:hover {
    background: ${props => props.theme.palette.secondary.main};
  }

  .MuiAvatar-root {
    height: 1.3rem;
    width: 1.3rem;
  }

  .MuiAvatar-root {
    color: white;
    background: ${props => props.theme.palette.success.main};
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

export const ProfileButton = ({ user, MenuOptions, className }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const userInitial = user.name.substring(0, 1);
  const userFirstName = user.firstName ? user.firstName : user.name.replace(/ .*/, '');

  return (
    <>
      <StyledButton
        onClick={handleClick}
        className={className}
        endIcon={<Avatar>{userInitial}</Avatar>}
      >
        {userFirstName}
      </StyledButton>
      <Popper keepMounted disablePortal anchorEl={anchorEl} open={open} placement="bottom-end">
        <Paper>
          <Header>
            <Avatar>{userInitial}</Avatar>
            <Details>
              <NameText>{user.name}</NameText>
              <EmailText>{user.email}</EmailText>
            </Details>
          </Header>
          <MuiList>
            <MenuOptions />
          </MuiList>
        </Paper>
      </Popper>
    </>
  );
};

ProfileButton.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string,
  }).isRequired,
  MenuOptions: PropTypes.any.isRequired,
  className: PropTypes.string,
};

ProfileButton.defaultProps = {
  className: null,
};
