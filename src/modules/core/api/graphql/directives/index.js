import {
  UpperCaseDirective as upper,
  LowerCaseDirective as lower,
  PrivateResourceDirective as authenticated
} from './schema-directive'

// eslint-disable-next-line
export default modules => {
  return {
    upper,
    lower,
    authenticated
  }
}
