import { mockEthers } from '../../test/mock-utils';
const checkAuthorizationStatusesMock = jest.fn();
const getTemplatesMock = jest.fn();
const estimateGasWithdrawalMock = jest.fn();
const failMock = jest.fn();
const fulfillMock = jest.fn();
const fulfillWithdrawalMock = jest.fn();
const staticFulfillMock = jest.fn();
mockEthers({
  airnodeRrpMocks: {
    callStatic: {
      fulfill: staticFulfillMock,
    },
    estimateGas: {
      fulfillWithdrawal: estimateGasWithdrawalMock,
    },
    checkAuthorizationStatuses: checkAuthorizationStatusesMock,
    fail: failMock,
    fulfill: fulfillMock,
    fulfillWithdrawal: fulfillWithdrawalMock,
    getTemplates: getTemplatesMock,
  },
});

import fs from 'fs';
import { ethers } from 'ethers';
import * as adapter from '@api3/airnode-adapter';
import * as validator from '@api3/airnode-validator';
import { startCoordinator } from './start-coordinator';
import * as fixtures from '../../test/fixtures';

describe('startCoordinator', () => {
  it('fetches and processes requests', async () => {
    jest.setTimeout(30000);
    const config = fixtures.buildConfig();
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(config));
    jest.spyOn(validator, 'validateJsonWithTemplate').mockReturnValue({ valid: true, messages: [] });

    const getBlockNumberSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBlockNumber');
    getBlockNumberSpy.mockResolvedValueOnce(12);

    const templateRequest = fixtures.evm.logs.buildMadeTemplateRequest();
    const getLogsSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getLogs');
    getLogsSpy.mockResolvedValueOnce([templateRequest]);

    const executeSpy = jest.spyOn(adapter, 'buildAndExecuteRequest') as jest.SpyInstance;
    executeSpy.mockResolvedValue({
      data: { result: '443.76381' },
      status: 200,
    });

    getTemplatesMock.mockResolvedValueOnce(fixtures.evm.airnodeRrp.getTemplates());
    checkAuthorizationStatusesMock.mockResolvedValueOnce([true]);

    const gasPrice = ethers.BigNumber.from(1000);
    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    gasPriceSpy.mockResolvedValueOnce(gasPrice);

    const txCountSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getTransactionCount');
    txCountSpy.mockResolvedValueOnce(212);

    const balanceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBalance');
    balanceSpy.mockResolvedValueOnce(ethers.BigNumber.from(250_000_000));

    estimateGasWithdrawalMock.mockResolvedValueOnce(ethers.BigNumber.from(50_000));
    staticFulfillMock.mockResolvedValueOnce({ callSuccess: true });
    fulfillMock.mockResolvedValueOnce({
      hash: '0xad33fe94de7294c6ab461325828276185dff6fed92c54b15ac039c6160d2bac3',
    });

    await startCoordinator(config);

    // API call was submitted
    expect(fulfillMock).toHaveBeenCalledTimes(1);
    expect(fulfillMock).toHaveBeenCalledWith(
      '0xbb7a523ebcb9c151457d6ea26ced6bbc0fab1aa7f170156bd0f63a295e5f8e16',
      '0xA30CA71Ba54E83127214D3271aEA8F5D6bD4Dace',
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      '0x7c1de7e1',
      '0x0000000000000000000000000000000000000000000000000000000002a5213d',
      '0xddf643d543a2c2ce3e80b42e060ecc0297e172678cec56930661b0a648c1af3b68fc2ee118331562a6d8827095cc212bb111244f53e8189c3d97613002c5e2461c',
      { gasLimit: 500_000, gasPrice, nonce: 212 }
    );
  });

  it('returns early if there are no processable requests', async () => {
    const config = fixtures.buildConfig();
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(config));

    const getBlockNumberSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBlockNumber');
    getBlockNumberSpy.mockResolvedValueOnce(12);

    const getLogsSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getLogs');
    getLogsSpy.mockResolvedValueOnce([]);

    getTemplatesMock.mockResolvedValueOnce(fixtures.evm.airnodeRrp.getTemplates());
    checkAuthorizationStatusesMock.mockResolvedValueOnce([true]);

    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    const executeSpy = jest.spyOn(adapter, 'buildAndExecuteRequest') as jest.SpyInstance;
    const txCountSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getTransactionCount');
    const balanceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBalance');

    const contract = new ethers.Contract('address', ['ABI']);

    await startCoordinator(config);

    expect(gasPriceSpy).not.toHaveBeenCalled();
    expect(executeSpy).not.toHaveBeenCalled();
    expect(txCountSpy).not.toHaveBeenCalled();
    expect(balanceSpy).not.toHaveBeenCalled();
    expect(contract.fulfill).not.toHaveBeenCalled();
  });
});
