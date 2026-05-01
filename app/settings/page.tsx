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
} from 'lucide-react'
import NotificationsPanel from '@/components/NotificationsPanel'

type SettingsTab = 'general' | 'ai-keys' | 'github' | 'notifications'

const settingsTabs: Array<{ id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'ai-keys', label: 'AI Keys', icon: Key },
  { id: 'github', label: 'GitHub Token', icon: Github },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
                    <a
                      href="/notifications"
                      className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                    >
                      View full page →
                    </a>
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

            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
