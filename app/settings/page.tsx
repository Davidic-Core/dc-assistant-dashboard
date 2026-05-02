'use client'

import { useState } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import {
  Settings as SettingsIcon,
  Key,
  Github,
  Save,
  Eye,
  EyeOff,
  Bell,
  Code2,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import NotificationsPanel from '@/components/NotificationsPanel'

type SettingsTab = 'general' | 'ai-keys' | 'github' | 'notifications' | 'environment'

const settingsTabs: Array<{ id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'ai-keys', label: 'AI Keys', icon: Key },
  { id: 'github', label: 'GitHub Token', icon: Github },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'environment', label: 'Environment', icon: Code2 },
]

interface EnvVariable {
  id: string
  key: string
  value: string
  isSecret: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

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
  const [envSaved, setEnvSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addEnvVariable = () => {
    if (newEnvKey.trim()) {
      setEnvVariables([
        ...envVariables,
        { id: Date.now().toString(), key: newEnvKey, value: newEnvValue, isSecret: newEnvIsSecret },
      ])
      setNewEnvKey('')
      setNewEnvValue('')
      setNewEnvIsSecret(false)
      setEnvSaved(true)
      setTimeout(() => setEnvSaved(false), 2000)
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
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-text-secondary mt-2">
            Manage your account, API keys, and preferences
          </p>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-card border border-card-border rounded-lg p-2 sticky top-20">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                        isActive
                          ? 'bg-accent text-background'
                          : 'text-text-secondary hover:text-foreground hover:bg-card-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-card border border-card-border rounded-lg p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">General Settings</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue="Davidic-Core"
                      className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="davidic.core@example.com"
                      className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Theme
                    </label>
                    <select className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                      <option>Dark (default)</option>
                      <option>Light</option>
                      <option>Auto</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* AI Keys */}
              {activeTab === 'ai-keys' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">AI API Keys</h2>
                  </div>

                  {['OpenAI API Key', 'Anthropic API Key', 'Google Gemini Key'].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {key}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={`Enter your ${key}`}
                            className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <button className="px-4 py-2.5 bg-card-border hover:bg-card-border/80 text-foreground rounded-lg transition-colors">
                          Test
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Keys'}
                  </button>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Notifications</h2>
                    <p className="text-text-secondary text-sm">
                      Manage and review your recent notifications
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        3 Unread
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-card-border text-text-secondary">
                        8 Total
                      </span>
                    </div>
                  </div>

                  <NotificationsPanel
                    notifications={[
                      {
                        id: '1',
                        type: 'success',
                        title: 'Build Successful',
                        message: 'dc-assistant-dashboard production build completed successfully',
                        timestamp: '10 minutes ago',
                      },
                      {
                        id: '2',
                        type: 'info',
                        title: 'Security Alert',
                        message: 'New dependency update available: lodash v4.17.21',
                        timestamp: '1 hour ago',
                      },
                      {
                        id: '3',
                        type: 'alert',
                        title: 'Failed Test',
                        message: 'Unit tests in neural-network-framework failed: 3 failures',
                        timestamp: '3 hours ago',
                      },
                      {
                        id: '4',
                        type: 'success',
                        title: 'Deployment Complete',
                        message: 'New version of distributed-cache-system deployed to production',
                        timestamp: '5 hours ago',
                      },
                      {
                        id: '5',
                        type: 'pending',
                        title: 'Code Review Waiting',
                        message: 'Your PR #512 in blockchain-explorer is waiting for review',
                        timestamp: '1 day ago',
                      },
                    ]}
                  />
                </div>
              )}

              {/* GitHub Token */}
              {activeTab === 'github' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">GitHub Token</h2>
                  </div>

                  <div className="bg-card-border/50 border border-card-border rounded-lg p-4 mb-4">
                    <p className="text-sm text-text-secondary">
                      Use a personal access token for GitHub integration. You can create one in your GitHub settings.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Personal Access Token
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="flex-1 px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                      <button className="px-4 py-2.5 bg-card-border hover:bg-card-border/80 text-foreground rounded-lg transition-colors">
                        Verify
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-sm text-green-400">Token is valid and connected</p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Token'}
                  </button>
                </div>
              )}

              {/* Environment Variables */}
              {activeTab === 'environment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Environment Variables</h2>
                    <p className="text-text-secondary text-sm">
                      Manage environment variables and secrets for your application
                    </p>
                  </div>

                  {/* Add New Variable Section */}
                  <div className="border border-card-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-accent" />
                      <h3 className="text-base font-semibold text-foreground">Add New Variable</h3>
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
                        {envSaved ? 'Added!' : 'Add Variable'}
                      </button>
                    </div>
                  </div>

                  {/* Environment Variables List */}
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">Current Variables</h3>

                    {envVariables.length === 0 ? (
                      <div className="border border-card-border rounded-lg p-12 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-text-tertiary opacity-50" />
                        <p className="text-text-tertiary">No environment variables set</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {envVariables.map((env) => (
                          <div
                            key={env.id}
                            className="bg-background border border-card-border rounded-lg p-4 flex items-center gap-4 group hover:border-accent/30 transition-colors"
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                              <div>
                                <p className="text-xs text-text-secondary mb-1">Key</p>
                                <input
                                  type="text"
                                  value={env.key}
                                  onChange={(e) => updateEnvVariable(env.id, 'key', e.target.value)}
                                  className="w-full px-3 py-2 bg-card border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono"
                                />
                              </div>

                              <div>
                                <p className="text-xs text-text-secondary mb-1">Value</p>
                                <input
                                  type={env.isSecret ? 'password' : 'text'}
                                  value={env.value}
                                  onChange={(e) => updateEnvVariable(env.id, 'value', e.target.value)}
                                  className="w-full px-3 py-2 bg-card border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono"
                                />
                              </div>

                              <div>
                                <p className="text-xs text-text-secondary mb-1">Type</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleSecretVisibility(env.id)}
                                    className="flex-1 px-3 py-2 bg-card border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm flex items-center justify-center gap-2 hover:border-accent/50 transition-colors"
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

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 bg-card-border/30 border border-card-border rounded-lg p-3">
                      <p className="text-xs text-text-secondary">
                        <strong>Note:</strong> Variables marked as "Secret" are hidden by default. Store sensitive data like API keys and tokens as secrets.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSaved(true)
                        setTimeout(() => setSaved(false), 2000)
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      <Save className="w-4 h-4" />
                      {saved ? 'Saved!' : 'Save All'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
