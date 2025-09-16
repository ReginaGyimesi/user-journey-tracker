import React from 'react';
import { useTranslation } from 'react-i18next';

export const I18nTest: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px' }}>
      <h4>i18n Test Component</h4>
      <p>Current language: {i18n.language}</p>
      <p>Dashboard title: {t('dashboard.title')}</p>
      <p>Users title: {t('users.title')}</p>
      <p>Navigation dashboard: {t('navigation.dashboard')}</p>
    </div>
  );
};