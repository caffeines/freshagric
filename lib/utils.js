const formatValue = (name, type, value) => {
  switch (type) {
    case 'number':
      if (isNaN(value)) { // eslint-disable-line no-restricted-globals
        throw new Error(`${name} must be a number`);
      }
      return Number(value);

    case 'boolean':
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new Error(`${name} must be true or false`);

    case 'string[]':
      return value.split(',');

    default:
      return value;
  }
};

const formatEnv = (vars) => {
  const formattedVars = {};
  vars.forEach((option) => {
    const defaultOption = {
      isOptional: false,
      type: 'string',
    };
    // eslint-disable-next-line no-param-reassign
    option = { ...defaultOption, ...option };

    const {
      name, type, defaultValue,
    } = option;

    const val = process.env[name];
    if (val === null || val === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Environment variable ${name} must be defined`);
      }
      formattedVars[name] = defaultValue;
    } else {
      formattedVars[name] = formatValue(name, type, val);
    }
  });
  return formattedVars;
};

exports.formatEnv = formatEnv;
