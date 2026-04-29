'use client'

import { useState } from 'react'
import LayoutWrapper from '@/components/LayoutWrapper'
import {
  Settings as SettingsIcon,
  Key,
  Github,
  Terminal,
  Code,
  Bell,
  Save,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
} from 'lucide-react'

type SettingsTab = 'general' | 'ai-keys' | 'github' | 'terminal' | 'environment' | 'notifications'

const settingsTabs: Array<{ id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'ai-keys', label: 'AI Keys', icon: Key },
  { id: 'github', label: 'GitHub Token', icon: Github },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'environment', label: 'Environment', icon: Code },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

interface EnvVariable {
  id: string
  key: string
  value: string
  isSecret: boolean
}

interface TerminalCommand {
  id: string
  command: string
  output: string
  timestamp: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    { id: '1', key: 'NODE_ENV', value: 'production', isSecret: false },
    { id: '2', key: 'API_BASE_URL', value: 'https://api.example.com', isSecret: false },
    { id: '3', key: 'API_KEY', value: '••••••••••••••••', isSecret: true },
  ])
  const [newEnvKey, setNewEnvKey] = useState('')
  const [newEnvValue, setNewEnvValue] = useState('')
  const [editingEnvId, setEditingEnvId] = useState<string | null>(null)
  const [terminalHistory, setTerminalHistory] = useState<TerminalCommand[]>([
    {
      id: '1',
      command: 'npm run build',
      output: '> DC Assistant@1.0.0 build\n> next build\nCompiled successfully!',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
    },
    {
      id: '2',
      command: 'git status',
      output: 'On branch front-end\nYour branch is up to date with origin/front-end.\nnothing to commit, working tree clean',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
    },
  ])
  const [terminalInput, setTerminalInput] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addEnvVariable = () => {
    if (newEnvKey.trim()) {
      setEnvVariables([
        ...envVariables,
        { id: Date.now().toString(), key: newEnvKey, value: newEnvValue, isSecret: false },
      ])
      setNewEnvKey('')
      setNewEnvValue('')
      handleSave()
    }
  }

  const deleteEnvVariable = (id: string) => {
    setEnvVariables(envVariables.filter((env) => env.id !== id))
  }

  const updateEnvVariable = (id: string, field: 'key' | 'value', val: string) => {
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

  const executeCommand = () => {
    if (!terminalInput.trim()) return

    const newCommand: TerminalCommand = {
      id: Date.now().toString(),
      command: terminalInput,
      output: `\$ ${terminalInput}\nCommand executed successfully at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toLocaleTimeString(),
    }

    setTerminalHistory([...terminalHistory, newCommand])
    setTerminalInput('')
  }

  const clearTerminal = () => {
    setTerminalHistory([])
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

              {/* Terminal Settings */}
              {activeTab === 'terminal' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Terminal</h2>
                  </div>

                  {/* Terminal Window */}
                  <div className="border border-card-border rounded-lg overflow-hidden bg-background">
                    {/* Terminal Header */}
                    <div className="bg-card-border px-4 py-3 flex items-center gap-2 border-b border-card-border">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <span className="text-xs text-text-secondary ml-2">DC Assistant Terminal</span>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-text-tertiary">bash</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    </div>

                    {/* Terminal Content */}
                    <div className="p-4 space-y-3 font-mono text-sm h-64 overflow-y-auto">
                      {terminalHistory.length === 0 ? (
                        <div className="text-text-tertiary text-xs">
                          No commands executed yet. Try running a command below.
                        </div>
                      ) : (
                        terminalHistory.map((cmd) => (
                          <div key={cmd.id} className="space-y-1">
                            <div className="text-accent">
                              <span>{'$ '}</span>
                              <span className="text-foreground">{cmd.command}</span>
                            </div>
                            <div className="text-text-secondary text-xs whitespace-pre-wrap">
                              {cmd.output}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Terminal Input */}
                    <div className="border-t border-card-border px-4 py-3 bg-card-border/30 flex gap-2">
                      <span className="text-accent font-mono text-sm">{'$ '}</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                        placeholder="Enter command..."
                        className="flex-1 bg-transparent text-foreground focus:outline-none font-mono text-sm placeholder:text-text-tertiary"
                      />
                      <button
                        onClick={executeCommand}
                        className="p-1.5 text-accent hover:text-accent-hover transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Terminal Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={clearTerminal}
                      className="px-4 py-2 bg-card-border hover:bg-card-border/80 text-foreground rounded-lg text-sm transition-colors"
                    >
                      Clear Log
                    </button>
                  </div>

                  {/* Terminal Settings */}
                  <div className="bg-card-border/30 border border-card-border rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Shell Type
                      </label>
                      <select className="w-full px-4 py-2 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm">
                        <option>bash</option>
                        <option>zsh</option>
                        <option>fish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Font Size
                      </label>
                      <input
                        type="number"
                        defaultValue="12"
                        min="8"
                        max="24"
                        className="w-full px-4 py-2 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked id="history" className="w-4 h-4" />
                      <label htmlFor="history" className="text-sm text-foreground">
                        Save command history
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Environment Variables */}
              {activeTab === 'environment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Environment Variables</h2>
                  </div>

                  {/* Add New Variable Section */}
                  <div className="bg-card-border/30 border border-card-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-accent" />
                      <h3 className="text-sm font-medium text-foreground">Add New Variable</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={newEnvKey}
                        onChange={(e) => setNewEnvKey(e.target.value)}
                        placeholder="Variable name (e.g., API_KEY)"
                        className="px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newEnvValue}
                          onChange={(e) => setNewEnvValue(e.target.value)}
                          placeholder="Variable value"
                          className="flex-1 px-4 py-2.5 bg-background border border-card-border rounded-lg text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                        />
                        <button
                          onClick={addEnvVariable}
                          className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Environment Variables List */}
                  <div className="space-y-2">
                    {envVariables.map((env) => (
                      <div
                        key={env.id}
                        className="bg-card-border/30 border border-card-border rounded-lg p-4 flex items-center gap-3 group"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={env.key}
                              onChange={(e) => updateEnvVariable(env.id, 'key', e.target.value)}
                              className="px-3 py-2 bg-background border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                            />
                            <div className="flex gap-2">
                              <input
                                type={env.isSecret ? 'password' : 'text'}
                                value={env.value}
                                onChange={(e) => updateEnvVariable(env.id, 'value', e.target.value)}
                                className="flex-1 px-3 py-2 bg-background border border-card-border rounded text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                              />
                              <button
                                onClick={() => toggleSecretVisibility(env.id)}
                                className="px-2 py-2 text-text-tertiary hover:text-foreground transition-colors"
                                title={env.isSecret ? 'Show value' : 'Hide value'}
                              >
                                {env.isSecret ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEnvVariable(env.id)}
                          className="p-2 text-text-tertiary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete variable"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {envVariables.length === 0 && (
                      <div className="text-center py-8 text-text-tertiary">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No environment variables set</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Variables'}
                  </button>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Notification Preferences</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Push Notifications', enabled: true },
                      { label: 'Email Notifications', enabled: true },
                      { label: 'Build Alerts', enabled: true },
                      { label: 'Pull Request Updates', enabled: true },
                      { label: 'Weekly Digest', enabled: false },
                    ].map((notif) => (
                      <div key={notif.label} className="flex items-center gap-3 p-3 bg-card-border/50 rounded-lg">
                        <input
                          type="checkbox"
                          defaultChecked={notif.enabled}
                          id={notif.label}
                          className="w-4 h-4 rounded"
                        />
                        <label htmlFor={notif.label} className="text-sm text-foreground">
                          {notif.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-background rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
