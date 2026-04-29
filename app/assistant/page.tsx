import LayoutWrapper from '@/components/LayoutWrapper'
import AIChat from '@/components/AIChat'
import { Lightbulb, Zap, Code, BarChart3 } from 'lucide-react'

const suggestedQuestions = [
  {
    icon: Code,
    title: 'Code Analysis',
    description: 'Analyze code patterns and suggest optimizations',
  },
  {
    icon: BarChart3,
    title: 'Repository Insights',
    description: 'Get detailed statistics about your projects',
  },
  {
    icon: Zap,
    title: 'Performance Tips',
    description: 'Receive recommendations for improving performance',
  },
  {
    icon: Lightbulb,
    title: 'Project Ideas',
    description: 'Get suggestions for new projects based on trends',
  },
]

export default function AssistantPage() {
  return (
    <LayoutWrapper>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">AI Assistant</h1>
          <p className="text-text-secondary mt-2">
            Get instant insights about your code and repositories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat */}
          <div className="lg:col-span-2 h-96">
            <AIChat />
          </div>

          {/* Suggested Questions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              What can I help with?
            </h2>
            <div className="space-y-3">
              {suggestedQuestions.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    className="w-full text-left bg-card border border-card-border rounded-lg p-4 hover:border-accent/50 hover:bg-card-border/50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-card-border rounded-lg group-hover:bg-accent/20 transition-colors flex-shrink-0">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Real-time Analysis',
                description: 'Analyze your code and repositories in real-time with instant feedback',
              },
              {
                title: 'Pattern Recognition',
                description: 'Detect common patterns and anti-patterns in your codebase',
              },
              {
                title: 'Performance Insights',
                description: 'Get detailed recommendations for optimizing your projects',
              },
              {
                title: 'Trend Analysis',
                description: 'Stay informed about the latest trends in your areas of interest',
              },
              {
                title: 'Security Scanning',
                description: 'Identify potential security vulnerabilities in your code',
              },
              {
                title: 'Documentation Help',
                description: 'Get help writing and improving your project documentation',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-card-border rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
