import type { Frame } from '../types';
import { DocFrame } from '../DocFrame';
import { TopBar } from '../../TopBar';
import { TestModeBanner } from '../../shared/TestModeBanner';
import { TestModeBadge } from '../../shared/TestModeBadge';
import { MOCK_ENTITLEMENTS } from '../../entitlements/mockEntitlements';
import { DocPageShell } from '../DocPageShell';

const FRAME_STYLE = { width: 1440, height: 900 };

const prodEntitlements = MOCK_ENTITLEMENTS.filter(e => e.environment === 'production').sort((a, b) => a.productName.localeCompare(b.productName));
const testEntitlements = MOCK_ENTITLEMENTS.filter(e => e.environment === 'test');

function EnvShell({ env, children }: { env: 'test' | 'production'; children: React.ReactNode }) {
  return (
    <DocFrame environment={env}>
      {children}
    </DocFrame>
  );
}

export const environmentFrames: Frame[] = [
  {
    id: 'env-production',
    title: 'TopBar — Production',
    description: 'Production pill is active (dark fill). This is the default state. All data shown is production data.',
    category: 'Switcher',
    render: () => (
      <EnvShell env="production">
        <div className="flex flex-col bg-[#f9fafb]" style={FRAME_STYLE}>
          <TopBar />
          <div className="px-8 pt-8">
            <p className="font-['Cabin',sans-serif] text-[15px] text-[#0a2333] font-semibold mb-2">Production environment active</p>
            <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">The "Production" pill in the TopBar is active. All data, API keys, and entitlements reflect the production environment.</p>
          </div>
        </div>
      </EnvShell>
    ),
  },
  {
    id: 'env-test',
    title: 'TopBar — Test',
    description: 'Test pill is active. Test mode banner appears below TopBar. Data switches to test environment.',
    category: 'Switcher',
    render: () => (
      <EnvShell env="test">
        <div className="flex flex-col bg-[#f9fafb]" style={FRAME_STYLE}>
          <TopBar />
          <TestModeBanner />
          <div className="px-8 pt-8">
            <p className="font-['Cabin',sans-serif] text-[15px] text-[#0a2333] font-semibold mb-2">Test environment active</p>
            <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282]">The "Test" pill is active, and a yellow banner appears below the TopBar warning that data is in test mode.</p>
          </div>
        </div>
      </EnvShell>
    ),
  },
  {
    id: 'env-test-banner',
    title: 'Test Mode Banner',
    description: 'Yellow warning banner: "You are viewing test data. Switch to Production to see live data." Dismissible.',
    category: 'Switcher',
    render: () => (
      <EnvShell env="test">
        <div className="flex flex-col bg-[#f9fafb]" style={FRAME_STYLE}>
          <TopBar />
          <TestModeBanner />
        </div>
      </EnvShell>
    ),
  },
  {
    id: 'env-benefits-comparison',
    title: 'Benefits — Prod vs Test',
    description: 'Production shows 5 entitlements, test shows 2. The environment context filters all data automatically.',
    category: 'Data Differences',
    render: () => (
      <DocFrame>
        <div className="flex flex-col bg-[#f9fafb]" style={FRAME_STYLE}>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 border-r border-[#e5e7eb] overflow-auto p-6">
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#0a2333] text-white font-['Cabin',sans-serif] text-[11px] font-semibold">Production</span>
                <span className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282] ml-2">{prodEntitlements.length} entitlements</span>
              </div>
              <div className="space-y-3">
                {prodEntitlements.map(e => (
                  <div key={e.id} className="bg-white rounded-lg border border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
                    <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium">{e.productName}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-['Cabin',sans-serif] ${
                      e.status === 'active' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#f3f4f6] text-[#0a2333] font-['Cabin',sans-serif] text-[11px] font-semibold border border-[#e5e7eb]">Test</span>
                <span className="font-['Cabin',sans-serif] text-[12px] text-[#6a7282] ml-2">{testEntitlements.length} entitlements</span>
              </div>
              <div className="space-y-3">
                {testEntitlements.map(e => (
                  <div key={e.id} className="bg-white rounded-lg border border-[#e5e7eb] px-4 py-3 flex items-center justify-between">
                    <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] font-medium">{e.productName}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-['Cabin',sans-serif] bg-[#dcfce7] text-[#166534]">active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DocFrame>
    ),
  },
  {
    id: 'env-test-badge',
    title: 'Test Mode Badge',
    description: 'Small "Test" badge appears next to page titles when in test environment. Visible on Benefits, Dashboard, etc.',
    category: 'Data Differences',
    render: () => (
      <EnvShell env="test">
        <DocPageShell activeView="entitlements" onNavigate={() => {}}>
          <div className="px-8 pt-5 pb-4">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">Benefits</h1>
              <TestModeBadge />
            </div>
            <p className="font-['Cabin',sans-serif] text-[13px] text-[#6a7282] mb-4">
              The TestModeBadge component renders a small "Test" label next to page titles when the environment is set to test mode.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <h1 className="font-['Cabin',sans-serif] font-bold text-[22px] text-[#0a2333]">Dashboard</h1>
              <TestModeBadge />
            </div>
          </div>
        </DocPageShell>
      </EnvShell>
    ),
  },
];
