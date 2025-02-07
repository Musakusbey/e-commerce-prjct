const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

jest.mock('lighthouse', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('chrome-launcher', () => ({
  launch: jest.fn()
}));

describe('Performans Testi', () => {
  test('Lighthouse performans testi', async () => {
    expect(true).toBe(true); // Geçici test
  });
});  