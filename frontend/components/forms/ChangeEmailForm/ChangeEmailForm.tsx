import React, { useState, useEffect } from "react";

import Button from "components/buttons/Button";
import InputField from "components/forms/fields/InputField";

const baseClass = "change-email-form";

interface IChangeEmailFormData {
  password: string;
}

interface IChangeEmailFormProps {
  formData?: Partial<IChangeEmailFormData>;
  handleSubmit: (formData: IChangeEmailFormData) => void;
  onCancel: () => void;
  serverErrors?: Record<string, string>;
}

const ChangeEmailForm = ({
  handleSubmit,
  onCancel,
  serverErrors = {},
}: IChangeEmailFormProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (serverErrors.password) {
      setError(serverErrors.password);
    }
  }, [serverErrors]);

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!password) {
      setError("Password must be present");
      return;
    }

    setError(null);
    handleSubmit({ password });
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
  };

  return (
    <form className={baseClass} onSubmit={onSubmit}>
      To update your email you must confirm your password.
      <InputField
        autofocus
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        error={error}
      />
      <div className="modal-cta-wrap">
        <Button type="submit">Submit</Button>
        <Button onClick={onCancel} variant="inverse">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ChangeEmailForm;
