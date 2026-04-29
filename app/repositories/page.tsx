import LayoutWrapper from '@/components/LayoutWrapper'
import RepositoryCard from '@/components/RepositoryCard'
import { Search, Filter, Star } from 'lucide-react'

const allRepositories = [
  {
    name: 'dc-assistant-dashboard',
    description: 'Premium GitHub Personal Assistant Dashboard with AI integration and real-time activity monitoring',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 342,
    forks: 89,
    lastUpdated: '2 hours ago',
  },
  {
    name: 'ai-code-analyzer',
    description: 'Advanced AI-powered code analysis tool for detecting patterns, vulnerabilities, and optimization opportunities',
    language: 'Python',
    languageColor: '#3776ab',
    stars: 521,
    forks: 134,
    lastUpdated: '1 day ago',
  },
  {
    name: 'quantum-computing-lib',
    description: 'High-performance quantum computing simulation library with GPU acceleration',
    language: 'Rust',
    languageColor: '#ce422b',
    stars: 289,
    forks: 62,
    lastUpdated: '3 days ago',
  },
  {
    name: 'neural-network-framework',
    description: 'Lightweight neural network framework designed for mobile and edge computing',
    language: 'C++',
    languageColor: '#00599c',
    stars: 456,
    forks: 112,
    lastUpdated: '5 days ago',
  },
  {
    name: 'distributed-cache-system',
    description: 'Distributed caching system with Redis compatibility and advanced partitioning strategies',
    language: 'Go',
    languageColor: '#00add8',
    stars: 678,
    forks: 156,
    lastUpdated: '1 week ago',
  },
  {
    name: 'blockchain-explorer',
    description: 'Full-featured blockchain explorer with transaction analysis and smart contract debugging',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 234,
    forks: 45,
    lastUpdated: '1 week ago',
  },
  {
    name: 'game-engine',
    description: '3D game engine with physics simulation, advanced rendering, and modding support',
    language: 'C#',
    languageColor: '#239120',
    stars: 512,
    forks: 128,
    lastUpdated: '2 weeks ago',
  },
  {
    name: 'mobile-ui-kit',
    description: 'Comprehensive React Native UI kit with 100+ components and dark mode support',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 1205,
    forks: 287,
    lastUpdated: '3 days ago',
  },
  {
    name: 'data-visualization-lib',
    description: 'Interactive data visualization library built with D3.js and WebGL',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 876,
    forks: 198,
    lastUpdated: '1 week ago',
  },
  {
    name: 'kubernetes-operator',
    description: 'Production-ready Kubernetes operator for managing distributed applications',
    language: 'Go',
    languageColor: '#00add8',
    stars: 445,
    forks: 103,
    lastUpdated: '4 days ago',
  },
  {
    name: 'ml-pipeline-framework',
    description: 'End-to-end machine learning pipeline framework with AutoML capabilities',
    language: 'Python',
    languageColor: '#3776ab',
    stars: 623,
    forks: 167,
    lastUpdated: '2 days ago',
  },
  {
    name: 'web-performance-toolkit',
    description: 'Comprehensive toolkit for analyzing and optimizing web application performance',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 234,
    forks: 56,
    lastUpdated: '5 days ago',
  },
]

export default function RepositoriesPage() {
  return (
    <LayoutWrapper>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Repositories</h1>
          <p className="text-text-secondary mt-2">
            Explore all your projects and repositories
          </p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search repositories..."
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-card-border rounded-lg text-foreground text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-lg hover:border-accent/50 hover:bg-card-border/50 transition-colors text-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-sm">Total</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {allRepositories.length}
            </p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-sm">Languages</p>
            <p className="text-2xl font-bold text-foreground mt-1">6</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-sm">Total Stars</p>
            <p className="text-2xl font-bold text-accent mt-1">8.4K</p>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-4">
            <p className="text-text-secondary text-sm">Most Popular</p>
            <p className="text-lg font-bold text-foreground mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-accent" />
              mobile-ui-kit
            </p>
          </div>
        </div>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allRepositories.map((repo) => (
            <RepositoryCard key={repo.name} {...repo} />
          ))}
        </div>
      </div>
    </LayoutWrapper>
  )
}
