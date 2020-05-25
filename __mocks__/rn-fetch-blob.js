const flushSpy = jest.fn().mockResolvedValue();
const fetchSpy = jest.fn().mockResolvedValue({
  readFile: jest.fn(() => 'base64Data'),
  flush: flushSpy,
  path: jest.fn(() => 'filePath'),
});

module.exports = {
  config: jest.fn(() => ({
    path: 'http://www.test.com',
    fileCache: true,
    fetch: fetchSpy,
  })),
  fs: { dirs: { DocumentDir: jest.fn() } },
  fetchSpy,
  flushSpy,
};
