import {
  UpperCaseDirective as upper,
  LowerCaseDirective as lower,
  AuthenticatedDirective as authenticated,
  AuthGuardDirective as authGuard
} from './schema-directive'

// eslint-disable-next-line
export default modules => {
  return {
    upper,
    lower,
    authenticated,
    authGuard
  }
}
