import { ethers } from 'ethers';
import { Config } from '@airnode/operation';

export function buildDeployConfig(config?: Partial<Config>): Config {
  return {
    deployerIndex: 0,
    apiProviders: {
      CurrencyConverterAPI: {
        mnemonic: ethers.Wallet.createRandom().mnemonic.phrase,
        endpoints: {
          convertToUSD: {
            authorizers: ['public'],
            oisTitle: 'currency-converter-ois',
          },
        },
        templates: {
          'template-1': {
            endpoint: 'convertToUSD',
            oisTitle: 'currency-converter-ois',
            fulfillClient: 'MockAirnodeClient',
            fulfillFunctionName: 'fulfill',
            requester: 'bob',
            parameters: [
              { type: 'bytes32', name: 'to', value: 'USD' },
              { type: 'bytes32', name: '_type', value: 'uint256' },
              { type: 'bytes32', name: '_path', value: 'result' },
              { type: 'bytes32', name: '_times', value: '100000' },
            ],
          },
        },
      },
    },
    authorizers: {
      public: '0x0000000000000000000000000000000000000000',
    },
    clients: {
      MockAirnodeClient: { endorsers: ['bob'] },
    },
    requesters: [
      {
        id: 'alice',
        apiProviders: {
          CurrencyConverterAPI: { ethBalance: '2' },
        },
      },
      {
        id: 'bob',
        apiProviders: {
          CurrencyConverterAPI: { ethBalance: '5' },
        },
      },
    ],
    requests: [
      {
        requesterId: 'bob',
        type: 'short',
        apiProvider: 'CurrencyConverterAPI',
        template: 'template-1',
        client: 'MockAirnodeClient',
        parameters: [],
      },
      {
        requesterId: 'bob',
        type: 'regular',
        apiProvider: 'CurrencyConverterAPI',
        template: 'template-1',
        client: 'MockAirnodeClient',
        fulfillFunctionName: 'fulfill',
        parameters: [],
      },
      {
        requesterId: 'bob',
        type: 'full',
        apiProvider: 'CurrencyConverterAPI',
        endpoint: 'convertToUSD',
        oisTitle: 'currency-converter-ois',
        client: 'MockAirnodeClient',
        fulfillFunctionName: 'fulfill',
        parameters: [],
      },
    ],
    ...config,
  };
}
