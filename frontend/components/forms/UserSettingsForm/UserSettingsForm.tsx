import React, { useState, useEffect, useCallback } from "react";

import Button from "components/buttons/Button";
import InputField from "components/forms/fields/InputField";
import validatePresence from "components/forms/validators/validate_presence";
import validEmail from "components/forms/validators/valid_email";

const baseClass = "manage-user";

interface IUserSettingsFormData {
  email: string;
  name: string;
  position: string;
}

interface IFormErrors {
  email?: string | null;
  name?: string | null;
}

interface IUserSettingsFormProps {
  formData: IUserSettingsFormData;
  handleSubmit: (formData: IUserSettingsFormData) => void;
  onCancel: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  pendingEmail?: string;
  serverErrors?: Record<string, string>;
  smtpConfigured: boolean;
}

const validate = (formData: IUserSettingsFormData) => {
  const errors: IFormErrors = {};

  if (!validatePresence(formData.email)) {
    errors.email = "Email field must be completed";
  } else if (!validEmail(formData.email)) {
    errors.email = `${formData.email} is not a valid email`;
  }

  if (!validatePresence(formData.name)) {
    errors.name = "Full name field must be completed";
  }

  return errors;
};

const UserSettingsForm = ({
  formData: initialFormData,
  handleSubmit,
  onCancel,
  pendingEmail,
  serverErrors = {},
  smtpConfigured,
}: IUserSettingsFormProps) => {
  const [formData, setFormData] = useState<IUserSettingsFormData>({
    email: initialFormData.email || "",
    name: initialFormData.name || "",
    position: initialFormData.position || "",
  });
  const [errors, setErrors] = useState<IFormErrors>({});

  useEffect(() => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [serverErrors]);

  const onFieldChange = useCallback(
    (fieldName: keyof IUserSettingsFormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    },
    []
  );

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const clientErrors = validate(formData);

    if (Object.keys(clientErrors).length === 0) {
      handleSubmit(formData);
      return;
    }

    setErrors((prev) => ({ ...prev, ...clientErrors }));
  };

  const renderEmailHelpText = () => {
    if (!pendingEmail) {
      return undefined;
    }

    return (
      <i className={`${baseClass}__email-help-text`}>
        Pending change to <b>{pendingEmail}</b>
      </i>
    );
  };

  return (
    <form onSubmit={onSubmit} className={baseClass} autoComplete="off">
      <div
        className="smtp-not-configured"
        data-tip
        data-for="smtp-tooltip"
        data-tip-disable={smtpConfigured}
      >
        <InputField
          autofocus
          label="Email (required)"
          name="email"
          value={formData.email}
          onChange={onFieldChange("email")}
          error={errors.email}
          helpText={renderEmailHelpText()}
          readOnly={!smtpConfigured}
          tooltip={
            <>
              Editing your email address requires that SMTP or SES is configured
              in order to send a validation email.
              <br />
              <br />
              Users with Admin role can configure SMTP in{" "}
              <strong>Settings &gt; Organization settings</strong>.
            </>
          }
        />
      </div>
      <InputField
        label="Full name (required)"
        name="name"
        value={formData.name}
        onChange={onFieldChange("name")}
        error={errors.name}
        inputOptions={{
          maxLength: 80,
        }}
      />
      <InputField
        label="Position"
        name="position"
        value={formData.position}
        onChange={onFieldChange("position")}
      />
      <div className="button-wrap">
        <Button type="submit">Update</Button>
        <Button onClick={onCancel} variant="inverse">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserSettingsForm;
