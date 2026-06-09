import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EcoSyncDashboard } from '../components/EcoSyncDashboard';

describe('EcoSyncDashboard Accessibility', () => {
  it('uses semantic HTML5 elements', () => {
    render(<EcoSyncDashboard />);

    // Check for main landmark (banner detection is tricky with nested headers)
    const mainLandmark = screen.getByRole('main', { name: /EcoSync Dashboard/i });
    expect(mainLandmark).toBeInTheDocument();

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // Check that the main page header exists
    expect(screen.getByText('EcoSync AI').closest('header')).toBeInTheDocument();
  });

  it('has a skip link for keyboard navigation', () => {
    render(<EcoSyncDashboard />);

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('has proper aria-labels on interactive elements', () => {
    render(<EcoSyncDashboard />);

    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toHaveAttribute('aria-label', 'Send message');

    const chatInput = screen.getByTestId('chat-input');
    expect(chatInput).toHaveAttribute('id', 'chat-input');

    const scanButton = screen.getByTestId('scan-button');
    expect(scanButton).toHaveAttribute('aria-label', 'Scan and analyze your receipt');
  });

  it('has proper role attributes on progress bars', () => {
    render(<EcoSyncDashboard />);

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);

    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '0');
    expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0');
    expect(progressBars[0]).toHaveAttribute('aria-valuemax', '1');

    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '3');
    expect(progressBars[1]).toHaveAttribute('aria-valuemax', '5');

    expect(progressBars[2]).toHaveAttribute('aria-valuenow', '0');
    expect(progressBars[2]).toHaveAttribute('aria-valuemax', '1');
  });

  it('has proper role on chat messages container', () => {
    render(<EcoSyncDashboard />);

    const messageLog = screen.getByRole('log', { name: /chat messages/i });
    expect(messageLog).toBeInTheDocument();
  });

  it('buttons have explicit type="button"', () => {
    render(<EcoSyncDashboard />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      if (button.type === 'submit') {
        // Form submit button
        expect(button).toHaveAttribute('type', 'submit');
      } else {
        expect(button).toHaveAttribute('type', 'button');
      }
    });
  });

  it('has screen reader only text for contextual information', () => {
    render(<EcoSyncDashboard />);

    const srOnly = screen.getAllByText((content, element) => {
      return element?.classList.contains('sr-only') && content.length > 0;
    });
    expect(srOnly.length).toBeGreaterThan(0);
  });
});

describe('EcoSyncDashboard Rendering', () => {
  it('renders the dashboard with all main sections', () => {
    render(<EcoSyncDashboard />);

    expect(screen.getByTestId('eco-dashboard')).toBeInTheDocument();
    expect(screen.getByText('EcoSync AI')).toBeInTheDocument();
    expect(screen.getByText('Carbon Footprint Tracker')).toBeInTheDocument();
    expect(screen.getByTestId('logo-icon')).toBeInTheDocument();
    expect(screen.getByTestId('credits-display')).toHaveTextContent('450 Credits');
  });

  it('renders the CO2 chart with correct total', () => {
    render(<EcoSyncDashboard />);

    expect(screen.getByTestId('co2-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-total')).toHaveTextContent('12');
  });

  it('renders the virtual forest with correct tree count', () => {
    render(<EcoSyncDashboard />);

    expect(screen.getByTestId('virtual-forest')).toBeInTheDocument();
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

    expect(screen.getByTestId('receipt-scanner')).toBeInTheDocument();
    expect(screen.getByText('Receipt-to-Impact Scanner')).toBeInTheDocument();
    expect(screen.getByTestId('scan-button')).toBeInTheDocument();
  });

  it('renders the AI chatbot component', () => {
    render(<EcoSyncDashboard />);

    expect(screen.getByTestId('ai-chatbot')).toBeInTheDocument();
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

    expect(screen.getByTestId('chart-total')).toHaveTextContent('30');
  });

  it('accepts custom eco credits', () => {
    render(<EcoSyncDashboard ecoCredits={750} />);

    expect(screen.getByTestId('credits-display')).toHaveTextContent('750 Credits');
    expect(screen.getByTestId('tree-count')).toHaveTextContent('7 trees');
  });

  it('accepts custom challenges', () => {
    const customChallenges = [
      {
        id: 'custom-1',
        title: 'Custom Challenge',
        description: 'Test challenge',
        reward: 100,
        progress: 5,
        total: 10,
        locked: false,
      },
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
