import React from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import ApiKeyManager from '../components/settings/ApiKeyManager';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Cog6ToothIcon className="h-8 w-8 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            AI Service Configuration
          </h2>
          <ApiKeyManager />
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
