const fs = require('fs');
const path = require('path');

const components = [
  'Navbar',
  'EventModule',
  'MarketplaceModule',
  'SportsModule',
  'NoticeStreamModule',
  'ProfileModal',
  'EmergencyQuickDial',
  'GlobalSearchModal',
  'TestRunModal',
  'AIAssistantModal',
  'MyScheduleModal',
  'EventPassModal',
  'MarketplaceChatDrawer',
  'NoticeDetailModal'
];

for (const c of components) {
  const file = path.join('src', 'components', c + '.tsx');
  if (!fs.existsSync(file)) {
    console.error('MISSING FILE:', file);
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  const hasNamedExport = text.includes(`export function ${c}`) || text.includes(`export const ${c}`);
  const hasDefaultExport = text.includes(`export default function ${c}`) || text.includes(`export default ${c}`);
  console.log(`Component ${c}: NamedExport=${hasNamedExport}, DefaultExport=${hasDefaultExport}`);
}
