import React, {
  SelectHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';
import ReactSelect, { StylesConfig } from 'react-select';
import ReactSelectCreatable from 'react-select/creatable';

import { Container, Error } from './styles';

interface Option {
  label: string | number;
  value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  placeholder: string;
  options: Option[];
  containerStyle?: object;
  isDisabled?: boolean;
  isMulti?: boolean;
  defaultValue?: any;
  component?: 'creatable' | 'default';
  icon?: React.ComponentType<IconBaseProps>;
}

const Select: React.FC<SelectProps> = ({
  name,
  placeholder,
  options,
  containerStyle = {},
  isDisabled = false,
  isMulti = false,
  component = 'default',
  icon: Icon,
}) => {
  const selectRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isField, setIsField] = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleSelectFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleSelectBlur = useCallback(() => {
    setIsFocused(false);
    setIsField(!!selectRef.current);
  }, []);

  useEffect(() => {
    defaultValue && selectRef?.current?.setValue(defaultValue);

    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: undefined,
      getValue: (ref: any) => {
        if (ref.state.selectValue.length) return ref.state.selectValue[0].value;
        return '';
      },
      setValue: (ref: any, value: any) => {
        ref.setValue(value);
        return value;
      },
    });
  }, [fieldName, defaultValue, registerField]);

  const styles: StylesConfig = {
    option: (provided, state) => {
      return {
        ...provided,
        backgroundColor: '#232129',
        borderBottom: '1px dotted #232129',
        color: state.isSelected ? '#ff9000' : '#fff',
        cursor: 'pointer',
        height: '40px',
        textAlign: 'left',
      };
    },
    menu: provided => {
      return {
        ...provided,
        border: 0,
      };
    },
    container: provided => {
      return {
        ...provided,
        border: 0,
        borderRadius: '10px',
        width: '300px',
      };
    },
    control: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;

      return {
        ...provided,
        backgroundColor: '#232129',
        color: '#666360',
        width: '100%',
        opacity,
        height: '55px',
        border: 0,
        borderRadius: '10px',
        textAlign: 'left',
        boxShadow: 'none',
      };
    },
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return {
        ...provided,
        opacity,
        transition,
        color: '#fff',
      };
    },
  };

  const Components = {
    creatable: (
      <ReactSelectCreatable
        ref={selectRef}
        name={name}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        isSearchable
        styles={styles}
        placeholder={placeholder}
        options={options}
        isMulti={isMulti}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
      />
    ),
    default: (
      <ReactSelect
        ref={selectRef}
        name={name}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        isSearchable
        styles={styles}
        placeholder={placeholder}
        options={options}
        isMulti={isMulti}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
      />
    ),
  };

  const Component: JSX.Element | React.ReactNode | React.FunctionComponent =
    Components[component];

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isField={isField}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}

      {Component}

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
