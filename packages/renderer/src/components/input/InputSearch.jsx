// @ts-nocheck
import React from 'react';

import './inputsearch.scss'

const InputSearch = (props) => {
  return (
    <input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange ? (e) => props.onChange(e) : null}
    />
  );
};

export default InputSearch;