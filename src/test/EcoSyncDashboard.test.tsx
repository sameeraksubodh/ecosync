import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EcoSyncDashboard } from '../components/EcoSyncDashboard';

describe('EcoSyncDashboard', () => {
  it('renders the dashboard with all main sections', () => {
    render(<EcoSyncDashboard />);

    // Check main dashboard container
    expect(screen.getByTestId('eco-dashboard')).toBeInTheDocument();

    // Check header elements
    expect(screen.getByText('EcoSync AI')).toBeInTheDocument();
    expect(screen.getByText('Carbon Footprint Tracker')).toBeInTheDocument();
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();

    // Check credits display
    expect(screen.getByTestId('credits-display')).toHaveTextContent('450 Credits');
  });

  it('renders the CO2 chart with correct total', () => {
    render(<EcoSyncDashboard />);

    const chartContainer = screen.getByTestId('co2-chart');
    expect(chartContainer).toBeInTheDocument();

    // Total should be 4.2 + 5.8 + 2.0 = 12
    expect(screen.getByTestId('chart-total')).toHaveTextContent('12');
  });

  it('renders the virtual forest with correct tree count', () => {
    render(<EcoSyncDashboard />);

    const forestContainer = screen.getByTestId('virtual-forest');
    expect(forestContainer).toBeInTheDocument();

    // 450 credits / 100 = 4 trees
    expect(screen.getByTestId('tree-count')).toHaveTextContent('4 trees');
  });

  it('renders three KPI cards with correct values', () => {
    render(<EcoSyncDashboard />);

    const kpiCards = screen.getAllByTestId('kpi-card');
    expect(kpiCards).toHaveLength(3);

    const kpiValues = screen.getAllByTestId('kpi-value');
    expect(kpiValues[0]).toHaveTextContent('12.0 kg');
    expect(kpiValues[1]).toHaveTextContent('#12');
    expect(kpiValues[2]).toHaveTextContent('156 kg');
  });

  it('renders the receipt scanner component', () => {
    render(<EcoSyncDashboard />);

    const scanner = screen.getByTestId('receipt-scanner');
    expect(scanner).toBeInTheDocument();

    expect(screen.getByText('Receipt-to-Impact Scanner')).toBeInTheDocument();
    expect(screen.getByTestId('scan-button')).toBeInTheDocument();
  });

  it('renders the AI chatbot component', () => {
    render(<EcoSyncDashboard />);

    const chatbot = screen.getByTestId('ai-chatbot');
    expect(chatbot).toBeInTheDocument();

    expect(screen.getByText('EcoCoach AI')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('renders all three challenge cards', () => {
    render(<EcoSyncDashboard />);

    const challengeCards = screen.getAllByTestId('challenge-card');
    expect(challengeCards).toHaveLength(3);

    expect(screen.getByText('Meatless Monday Quest')).toBeInTheDocument();
    expect(screen.getByText('Commute Commando')).toBeInTheDocument();
    expect(screen.getByText('Unplugged Evening')).toBeInTheDocument();
  });

  it('displays challenge progress correctly', () => {
    render(<EcoSyncDashboard />);

    const progressTexts = screen.getAllByTestId('challenge-progress');
    expect(progressTexts[0]).toHaveTextContent('0/1');
    expect(progressTexts[1]).toHaveTextContent('3/5');
  });
});

describe('Custom Props', () => {
  it('accepts custom chart data', () => {
    const customChartData = [
      { category: 'Transport', value: 10, color: '#3b82f6' },
      { category: 'Food', value: 20, color: '#f59e0b' },
    ];

    render(<EcoSyncDashboard chartData={customChartData} />);

    // Total should be 10 + 20 = 30
    expect(screen.getByTestId('chart-total')).toHaveTextContent('30');
  });

  it('accepts custom eco credits', () => {
    render(<EcoSyncDashboard ecoCredits={750} />);

    expect(screen.getByTestId('credits-display')).toHaveTextContent('750 Credits');
    expect(screen.getByTestId('tree-count')).toHaveTextContent('7 trees');
  });

  it('accepts custom challenges', () => {
    const customChallenges = [
      { id: 'custom-1', title: 'Custom Challenge', description: 'Test challenge', reward: 100, progress: 5, total: 10, locked: false },
    ];

    render(<EcoSyncDashboard challenges={customChallenges} />);

    expect(screen.getByText('Custom Challenge')).toBeInTheDocument();
  });
});

describe('Receipt Scanner Interaction', () => {
  it('shows loading state when scan button is clicked', { timeout: 10000 }, async () => {
    const user = userEvent.setup();
    render(<EcoSyncDashboard />);

    const scanButton = screen.getByTestId('scan-button');
    await user.click(scanButton);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
