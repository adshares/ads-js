const Ads = require('../dist/index.cjs')

test('address checksum', () => {
  expect(Ads.addressChecksum('0000', '00000000')).toBe('313E')
  expect(Ads.addressChecksum('0001', '00000001')).toBe('8B4E')
  expect(Ads.addressChecksum('0005', '0000047E')).toBe('41F4')
  expect(Ads.addressChecksum('00ab', '00000a7e')).toBe('8737')
  expect(Ads.addressChecksum('0xFFFF', '0xFFFFFFFF')).toBe('A6E1')
})

test('compare addresses', () => {
  expect(Ads.compareAddresses('0005-0000047E-41F4', '0005-0000047E-41F4')).toBe(true)
  expect(Ads.compareAddresses('0005-0000047E-41F4', '0005-0000047e-41f4')).toBe(true)
  expect(Ads.compareAddresses('0005-0000047E-41F4', '0005-0000047E-XXXX')).toBe(true)
  expect(Ads.compareAddresses('0005-0000047E-XXXX', '0005-0000047E-XXXX')).toBe(true)
  expect(Ads.compareAddresses('0005-0000047E-41F4', '0005-0000047E-2222')).toBe(true)
  expect(Ads.compareAddresses('0005-0000047E-41F4', '0005-00000001-XXXX')).toBe(false)
  expect(Ads.compareAddresses('0002-0000047E-2620', '0005-0000047E-41F4')).toBe(false)
})

test('compare addresses by node', () => {
  expect(Ads.compareAddressesByNode('0005-0000047E-41F4', '0005-0000047E-41F4')).toBe(true)
  expect(Ads.compareAddressesByNode('0005-0000047E-41F4', '0005-00000002-322B')).toBe(true)
  expect(Ads.compareAddressesByNode('0002-0000047E-2620', '0005-0000047E-41F4')).toBe(false)
})

test('format address', () => {
  expect(Ads.formatAddress('0000', '00000000')).toBe('0000-00000000-313E')
  expect(Ads.formatAddress('0005', '0000047E')).toBe('0005-0000047E-41F4')
  expect(Ads.formatAddress('0x00ab', '0x00000a7e')).toBe('00AB-00000A7E-8737')
})

test('split address', () => {
  expect(Ads.splitAddress('foo_address')).toBe(null)
  expect(Ads.splitAddress('0002:0000047E:2620')).toBe(null)

  const parts1 = Ads.splitAddress('0005-0000047E-41F4')
  expect(parts1.nodeId).toBe('0005')
  expect(parts1.userAccountId).toBe('0000047E')
  expect(parts1.checksum).toBe('41F4')

  const parts2 = Ads.splitAddress('00ab-00000a7e-8737')
  expect(parts2.nodeId).toBe('00AB')
  expect(parts2.userAccountId).toBe('00000A7E')
  expect(parts2.checksum).toBe('8737')
})

test('validate address', () => {
  expect(Ads.validateAddress('0000-00000000-313E')).toBe(true)
  expect(Ads.validateAddress('0002-0000047E-2620')).toBe(true)
  expect(Ads.validateAddress('0002-0000047E-XXXX')).toBe(true)
  expect(Ads.validateAddress('00ab-00000a7e-8737')).toBe(true)
  expect(Ads.validateAddress('0002-0000047E-1111')).toBe(false)
  expect(Ads.validateAddress(null)).toBe(false)
  expect(Ads.validateAddress('')).toBe(false)
  expect(Ads.validateAddress('foo_address')).toBe(false)
})

test('validate ETH address', () => {
  expect(Ads.validateEthAddress('0xcfcecfe2bd2fed07a9145222e8a7ad9cf1ccd22a')).toBe(true)
  expect(Ads.validateEthAddress('0xCFCECFE2BD2FED07A9145222E8A7AD9CF1CCD22A')).toBe(true)
  expect(Ads.validateEthAddress('cfcecfe2bd2fed07a9145222e8a7ad9cf1ccd22a')).toBe(true)
  expect(Ads.validateEthAddress('0xcfcecfe2bd2fed07a9145222e')).toBe(false)
  expect(Ads.validateEthAddress('cfcecfe2bd2fed07a9145222e8a7ad9cf1ccd22a2bd2fed07a')).toBe(false)
  expect(Ads.validateEthAddress(null)).toBe(false)
  expect(Ads.validateEthAddress('')).toBe(false)
  expect(Ads.validateEthAddress('foo_address')).toBe(false)
})

test('validate key', () => {
  expect(Ads.validateKey('cfcaecfe2bd2fed07a91d9c45222e8a7ad9cf5222e8a7ad9cf1ccd22a1ccd22a')).toBe(true)
  expect(Ads.validateKey('CFCAECFE2BD2FED07A91D9C45222E8A7AD9CF5222E8A7AD9CF1CCD22A1CCD22A')).toBe(true)
  expect(Ads.validateKey('cfcecfe2bd2fed07a9145222e')).toBe(false)
  expect(Ads.validateKey('cfcecfe2bd7a9145222e8a7ad9cf2fed07a9145222e8a7ad97a9145222e8a7ad9cfcf1ccd22a2bd2fed07a'))
    .toBe(false)
  expect(Ads.validateKey(null)).toBe(false)
  expect(Ads.validateKey('')).toBe(false)
  expect(Ads.validateKey('foo_key')).toBe(false)
})
