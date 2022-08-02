import PropTypes from 'prop-types';
import { Input, Label } from '@pega/cosmos-react-core';

import StyledMyOrganizationPegaReactAcSampleReactPegaComponenntWrapper from './styles';

const MyOrganizationPegaReactAcSampleReactPegaComponennt = props => {
  const { getPConnect, value, placeholder, disabled, readOnly, required, label, testId } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn?.getStateProps()?.value;

  const handleOnChange = event => {
    const { value: updatedValue } = event.target;
    actions.updateFieldValue(propName, updatedValue);
  };

  return (
    <StyledMyOrganizationPegaReactAcSampleReactPegaComponenntWrapper>
      <h1>First pega custom react componenent by Chandrasekhar Allampati</h1>
      {/* <Label>{label}</Label>
      <Input
        type='text'
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={handleOnChange}
        testId={testId}
      /> */}
    </StyledMyOrganizationPegaReactAcSampleReactPegaComponenntWrapper>
  );
};

MyOrganizationPegaReactAcSampleReactPegaComponennt.defaultProps = {
  value: '',
  placeholder: '',
  disabled: false,
  readOnly: false,
  required: false,
  testId: null
};

MyOrganizationPegaReactAcSampleReactPegaComponennt.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string
};

export default MyOrganizationPegaReactAcSampleReactPegaComponennt;
