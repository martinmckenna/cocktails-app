import { connect } from 'react-redux';
import { Account, APIError } from 'src/services/types';
import { MapDispatchToProps, MapStateToProps } from 'src/store';
import { handleLogout as _handleLogout } from 'src/store/authentication/authentication.actions';

interface StateProps {
  account?: Account;
  accountLoading: boolean;
  accountError?: APIError;
  isLoggedIn: boolean;
}

const mapStateToProps: MapStateToProps<StateProps, {}> = state => ({
  account: state.accountState.account,
  accountError: state.accountState.accountError,
  accountLoading: state.accountState.accountLoading,
  isLoggedIn: !!state.authState.token
});

interface DispatchProps {
  handleLogout: () => void;
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
  handleLogout: () => dispatch(_handleLogout())
});

export type AccountProps = DispatchProps & StateProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
