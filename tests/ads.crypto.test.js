const Ads = require('../dist/index.cjs')

const hexSeed = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542'

test('sign empty string', () => {
  const secretKey = '9F7D754820842E3D141FA7BCF6A3BA731EFE77914AC67E00D1D223E7ADB6FA48'
  const data = ''
  const expSignature = 'bb4946aec4c1be7e1bcb11b27b3cfb13b3234417fcdc96356ceb910c233423b5692b93196471c75d1bdb9e8fe2bcad184e1a0b37976bdf228ff5a60d5173f80b'

  expect(Ads.Crypto.sign(secretKey, data)).toBe(expSignature)
})

test('sign data', () => {
  expect(Ads.Crypto.sign('CA978112CA1BBDCAFAC231B39A23DC4DA786EFF8147C4E72B9807785AFEE48BB', '74657374')).toBe(
    'fbf7ff4db3f5e300119904f07ed926f6b65d087d0019099ad3d83cf12bf310f26dbb6116a1a00af0012485c0ff7baaa504d46d3836e61668affed516b1420c01')
})

test('sign text', () => {
  expect(Ads.Crypto.signText('CA978112CA1BBDCAFAC231B39A23DC4DA786EFF8147C4E72B9807785AFEE48BB', 'test')).toBe(
    'fbf7ff4db3f5e300119904f07ed926f6b65d087d0019099ad3d83cf12bf310f26dbb6116a1a00af0012485c0ff7baaa504d46d3836e61668affed516b1420c01')
})

test('sign transaction', () => {
  // secret key is concatenation of private and public key
  const secretKey = 'BB3425F914CA9F661CA6F3B908E07092B5AFB7F2FDAE2E94EDE12C83207CA743'
  const hashin = '71BD0607F5B874B2B4ECC442A76D0FD7544FE12CD32BDDB6BA7F3D5755C40A1A'
  const txData = '04010000000000010000000100000001000000000000E87648170000000000000000000000000000000000000000000000000000000000000000000000'
  const data = hashin + txData
  const expSignature = 'f9c975d060d84ebca286e7c9e4aa68f0b77d005b98067c17e00aa93a102d48bb49a20233a37cbf3ba8bb1a8a8b94fc4832bc286b59ee66aa0ba01e2d3aa8cf0a'

  expect(Ads.Crypto.sign(secretKey, data)).toBe(expSignature)
})

test('invalid key length', () => {
  const secretKey = ''
  const data = ''
  expect(() => {
    Ads.Crypto.sign(secretKey, data)
  }).toThrow()
})

test('create private key from seed', () => {
  const seed = 'a'
  const expSecretKey = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
  const expPublicKey = 'eae1c8793b5597c4b3f490e76ac31172c439690f8ee14142bb851a61f9a49f0e'
  const expSg = '1f0571d30661fb1d50be0d61a0a0e97baeff8c030cd0269ade49438a4ad4cf897367e21b100c694f220d922200b3ab852a377d8857a64c36cb1569311760f303'

  const secretKey = Ads.Crypto.getSecretKey(seed)
  const publicKey = Ads.Crypto.getPublicKey(secretKey)
  const sg = Ads.Crypto.sign(secretKey, '')

  expect(secretKey).toBe(expSecretKey)
  expect(publicKey).toBe(expPublicKey)
  expect(expSg).toBe(sg)
})

test('validate signature', () => {
  expect(Ads.Crypto.validateSignature(
    '1F0571D30661FB1D50BE0D61A0A0E97BAEFF8C030CD0269ADE49438A4AD4CF897367E21B100C694F220D922200B3AB852A377D8857A64C36CB1569311760F303',
    'EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E',
    ''
  )).toBe(true)
  expect(Ads.Crypto.validateSignature(
    'A21AB5345F0604940A92C8BE74E13ED832E25A59B03D87D9E77B036571EE22B15D58FE51B09A2A54DDD22B3F92EBE65E58840B1CB2711A3623F9C008902B860C',
    'EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E',
    '666F6F'
  )).toBe(true)
  expect(Ads.Crypto.validateSignature(
    'a21ab5345f0604940a92c8be74e13ed832e25a59b03d87d9e77b036571ee22b15d58fe51b09a2a54ddd22b3f92ebe65e58840b1cb2711a3623f9c008902b860c',
    'eae1c8793b5597c4b3f490e76ac31172c439690f8ee14142bb851a61f9a49f0e',
    '666f6f'
  )).toBe(true)
  expect(Ads.Crypto.validateSignature(
    '1F0571D30661FB1D50BE0D61A0A0E97BAEFF8C030CD0269ADE49438A4AD4CF897367E21B100C694F220D922200B3AB852A377D8857A64C36CB1569311760F303',
    'EAE1C8793B5597C4B3F490E76AC31172C439690F8EE14142BB851A61F9A49F0E',
    '666F6F'
  )).toBe(false)
  expect(Ads.Crypto.validateSignature(
    'A21AB5345F0604940A92C8BE74E13ED832E25A59B03D87D9E77B036571EE22B15D58FE51B09A2A54DDD22B3F92EBE65E58840B1CB2711A3623F9C008902B860C',
    'A9C0D972D8AAB73805EC4A28291E052E3B5FAFE0ADC9D724917054E5E2690363',
    '666F6F'
  )).toBe(false)
})

test('master key from seed', () => {
  /* Chain m
   * fingerprint: 00000000
   * chain code: ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b
   * private: 171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012
   * public: 008fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a
   */
  const chain = Ads.Crypto.getMasterKey(hexSeed)
  expect(chain.key).toBe('171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012')
  expect(chain.chainCode).toBe('ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b')
  expect(Ads.Crypto.getPublicKey(chain.key)).toBe('8fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a')
})

test('derivePath m/0\' from seed', () => {
  /* Chain m/0H
   * fingerprint: 31981b50
   * chain code: 0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d
   * private: 1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635
   * public: 0086fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037
   */
  const chain = Ads.Crypto.getNextKey('m/0\'', hexSeed)
  expect(chain.key).toBe('1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635')
  expect(chain.chainCode).toBe('0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d')
  expect(Ads.Crypto.getPublicKey(chain.key)).toBe('86fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037')
})

test('derivePath m/0\'/2147483647\' from seed', () => {
  /* Chain m/0H/2147483647H
   * fingerprint: 1e9411b1
   * chain code: 138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f
   * private: ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4
   * public: 005ba3b9ac6e90e83effcd25ac4e58a1365a9e35a3d3ae5eb07b9e4d90bcf7506d
   */
  const chain = Ads.Crypto.getNextKey('m/0\'/2147483647\'', hexSeed)
  expect(chain.key).toBe('ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4')
  expect(chain.chainCode).toBe('138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f')
  expect(Ads.Crypto.getPublicKey(chain.key)).toBe('5ba3b9ac6e90e83effcd25ac4e58a1365a9e35a3d3ae5eb07b9e4d90bcf7506d')
})

test('derivePath m/0\'/2147483647\'/1\' from seed', () => {
  /* Chain m/0H/2147483647H/1H
   * fingerprint: fcadf38c
   * chain code: 73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90
   * private: 3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c
   * public: 002e66aa57069c86cc18249aecf5cb5a9cebbfd6fadeab056254763874a9352b45
   */
  const chain = Ads.Crypto.getNextKey('m/0\'/2147483647\'/1\'', hexSeed)
  expect(chain.key).toBe('3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c')
  expect(chain.chainCode).toBe('73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90')
  expect(Ads.Crypto.getPublicKey(chain.key)).toBe('2e66aa57069c86cc18249aecf5cb5a9cebbfd6fadeab056254763874a9352b45')
})

test('derivePath m/0\'/2147483647\'/1\'/2147483646\' from seed', () => {
  /* Chain m/0H/2147483647H/1H/2147483646H
   * fingerprint: aca70953
   * chain code: 0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a
   * private: 5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72
   * public: 00e33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b
   */
  const chain = Ads.Crypto.getNextKey('m/0\'/2147483647\'/1\'/2147483646\'', hexSeed)
  expect(chain.key).toBe('5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72')
  expect(chain.chainCode).toBe('0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a')
  expect(Ads.Crypto.getPublicKey(chain.key)).toBe('e33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b')
})

test('derivePath m/0\'/2147483647\'/1\'/2147483646\'/2\' from seed', () => {
  /* Chain m/0H/2147483647H/1H/2147483646H/2H
   * fingerprint: 422c654b
   * chain code: 5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4
   * private: 551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d
   * public: 0047150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0
   */
  const chain = Ads.Crypto.getNextKey('m/0\'/2147483647\'/1\'/2147483646\'/2\'', hexSeed)
  expect(chain.key).toBe('551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d')
  expect(chain.chainCode).toBe('5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4')
  expect(Ads.Crypto.getPublicKey(chain.key)).toBe('47150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0')
})

test('get secret key', () => {
  expect(Ads.Crypto.getSecretKey('a')).toBe('ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb')
  expect(Ads.Crypto.getSecretKey('foo')).toBe('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae')
})

test('get public key', () => {
  expect(Ads.Crypto.getPublicKey('CA978112CA1BBDCAFAC231B39A23DC4DA786EFF8147C4E72B9807785AFEE48BB')).toBe('eae1c8793b5597c4b3f490e76ac31172c439690f8ee14142bb851a61f9a49f0e')
  expect(Ads.Crypto.getPublicKey('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae')).toBe('34d26579dbb456693e540672cf922f52dde0d6532e35bf06be013a7c532f20e0')
})
