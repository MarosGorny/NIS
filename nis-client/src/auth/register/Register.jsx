import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const defaultValues = {
    userid: '',
    password: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    const token = localStorage.getItem('logged-user');
    if (token) navigate('/');
  }, []);

  const onSubmit = (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: data.userid,
        pwd: data.password,
      }),
    };
    fetch('/auth/register', requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.message !== undefined) {
          navigate('/logout');
          navigate('/register');
          alert(res.message);
        } else {
          navigate('/login');
          window.location.reload();
        }
      });
    reset();
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  return (
    <div id="auth-page-container">
      <div id="auth-form-container">
        <h1>Registrácia</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-form-inputs-container">
            <div className="auth-form-input-field-container">
              <span className="p-float-label p-input-icon-right auth-form-input-icon">
                <i className="pi pi-user" />
                <Controller
                  name="userid"
                  control={control}
                  rules={{
                    required: 'Identifikácia je povinná',
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                        'auth-form-input': true,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="userid"
                  className={classNames({ 'p-error': !!errors.userid })}
                >
                  Prihlasovacie číslo*
                </label>
              </span>
              {getFormErrorMessage('userid')}
            </div>
            <div className="auth-form-input-field-container">
              <span className="p-float-label auth-form-input-icon">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required.' }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      toggleMask
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                        'auth-form-input': true,
                      })}
                      feedback={false}
                    />
                  )}
                />
                <label
                  htmlFor="password"
                  className={classNames({ 'p-error': errors.password })}
                >
                  Heslo*
                </label>
              </span>
              {getFormErrorMessage('password')}
            </div>
          </div>
          <div className="auth-form-buttons-container">
            <Link to="/login">
              <Button
                type="button"
                label="Už máte účet?"
                className="p-button-secondary p-button-link p-button-text"
              />
            </Link>
            <Button
              type="submit"
              label="Registrovať"
              style={{ marginRight: '1.25rem' }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
