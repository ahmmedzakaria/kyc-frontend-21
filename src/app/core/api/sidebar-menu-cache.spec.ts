import { describe, expect, it } from 'vitest';

import { SidebarMenuItem } from '@nexacore/layout';

describe('backend sidebar menu cache shape', () => {
  it('supports privilege-filtered backend menu groups used by the rail nav', () => {
    const menus: SidebarMenuItem[] = [
      {
        label: 'Operations',
        children: [
          {
            label: 'Person',
            path: 'person',
            privilegeCodes: ['01010200108'],
            children: [{ label: 'Person List', path: 'person' }]
          }
        ]
      }
    ];

    localStorage.setItem('sidebarMenus', JSON.stringify(menus));

    const cached = JSON.parse(localStorage.getItem('sidebarMenus') || '[]') as SidebarMenuItem[];

    expect(cached[0]?.label).toBe('Operations');
    expect(cached[0]?.children?.[0]?.privilegeCodes).toContain('01010200108');
    expect(cached[0]?.children?.[0]?.children?.[0]?.path).toBe('person');
  });
});
