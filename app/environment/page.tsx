'use client'

import { useState } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
} from 'lucide-react'

interface EnvVariable {
  id: string
  key: string
  value: string
  isSecret: boolean
}

export default function EnvironmentPage() {
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    { id: '1', key: 'NODE_ENV', value: 'development', isSecret: false },
    { id: '2', key: 'API_BASE_URL', value: 'https://api.example.com', isSecret: false },
    { id: '3', key: 'API_KEY', value: 'sk_live_123456789abcdef', isSecret: true },
    { id: '4', key: 'GITHUB_TOKEN', value: 'ghp_xxxxxxxxxxxxxxxxxxxx', isSecret: true },
    { id: '5', key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/db', isSecret: true },
  ])
  const [newEnvKey, setNewEnvKey] = useState('')
  const [newEnvValue, setNewEnvValue] = useState('')
  const [newEnvIsSecret, setNewEnvIsSecret] = useState(false)
  const [saved, setSaved] = useState(false)

  const addEnvVariable = () => {
    if (newEnvKey.trim()) {
      setEnvVariables([
        ...envVariables,
        { id: Date.now().toString(), key: newEnvKey, value: newEnvValue, isSecret: newEnvIsSecret },
      ])
      setNewEnvKey('')
      setNewEnvValue('')
      setNewEnvIsSecret(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const deleteEnvVariable = (id: string) => {
    setEnvVariables(envVariables.filter((env) => env.id !== id))
  }

  const updateEnvVariable = (id: string, field: 'key' | 'value' | 'isSecret', val: string | boolean) => {
    setEnvVariables(
      envVariables.map((env) => (env.id === id ? { ...env, [field]: val } : env))
    )
  }

  const toggleSecretVisibility = (id: string) => {
    setEnvVariables(
      envVariables.map((env) =>
        env.id === id ? { ...env, isSecret: !env.isSecret } : env
      )
    )
  }

  return (
    <LayoutWrapper>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Environment Variables</h1>
          <p className="text-text-secondary mt-2">
            Manage environment variables and secrets for your application
          </p>
        </div>

        {/* Add New Variable Section */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Add New Variable</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Variable Name
              </label>
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="e.g., API_KEY"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Variable Value
              </label>
              <input
                type={newEnvIsSecret ? 'password' : 'text'}
                value={newEnvValue}
                onChange={(e) => setNewEnvValue(e.target.value)}
                placeholder="e.g., your_secret_value"
                className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newEnvIsSecret}
                onChange={(e) => setNewEnvIsSecret(e.target.checked)}
                className="w-4 h-4 rounded border-card-border"
              />
              <span className="text-sm text-text-secondary">Mark as secret (hidden by default)</span>
            </label>

            <button
              onClick={addEnvVariable}
              disabled={!newEnvKey.trim()}
              className="ml-auto px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-background rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Variable
            </button>
          </div>
        </div>

        {/* Environment Variables List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Current Variables</h2>

          {envVariables.length === 0 ? (
            <div className="bg-card border border-card-border rounded-lg p-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-text-tertiary opacity-50" />
              <p className="text-text-tertiary">No environment variables set</p>
            </div>
          ) : (
            <div className="space-y-2">
              {envVariables.map((env) => (
                <div
                  key={env.id}
                  className="bg-card border border-card-border rounded-lg p-4 flex items-center gap-4 group hover:border-accent/30 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Key */}
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Key</p>
                      <input
                        type="text"
                        value={env.key}
                        onChange={(e) => updateEnvVariable(env.id, 'key', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono"
                      />
                    </div>

                    {/* Value */}
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Value</p>
                      <input
                        type={env.isSecret ? 'password' : 'text'}
                        value={env.value}
                        onChange={(e) => updateEnvVariable(env.id, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Type</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSecretVisibility(env.id)}
                          className="flex-1 px-3 py-2 bg-background border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm flex items-center justify-center gap-2 hover:border-accent/50 transition-colors"
                          title={env.isSecret ? 'Click to show value' : 'Click to hide value'}
                        >
                          {env.isSecret ? (
                            <>
                              <EyeOff className="w-4 h-4 text-accent" />
                              <span>Secret</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-text-tertiary" />
                              <span>Public</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteEnvVariable(env.id)}
                    className="p-2.5 text-text-tertiary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
                    title="Delete variable"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setSaved(true)
              setTimeout(() => setSaved(false), 2000)
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save All Changes'}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-card border border-card-border rounded-lg p-4">
          <p className="text-sm text-text-secondary">
            <strong>Note:</strong> Environment variables marked as "Secret" are hidden by default for security. Store sensitive data like API keys, tokens, and passwords as secrets. Variables are saved locally and should be synced with your deployment platform.
          </p>
        </div>
      </div>
    </LayoutWrapper>
  )
}
