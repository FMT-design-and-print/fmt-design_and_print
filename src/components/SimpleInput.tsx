import React from "react";
import { v4 as uid } from "uuid";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
}

export const SimpleInput = ({ label, ...rest }: Props) => {
  const labelId = uid();

  return (
    <div>
      {label && (
        <div>
          <label htmlFor={labelId}>{label}:</label>
        </div>
      )}
      <input id={labelId} className="simple-input" {...rest} />
    </div>
  );
};
