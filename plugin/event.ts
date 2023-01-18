export enum Event {
  Request = "web3WalletRequest",
}

export enum BackgroundEvent {
  SetPrivateKey = "background.setPrivateKey",
  GetPrivateKey = "background.getPrivateKey",
}

export enum InternalRpcMethods {
  EthSign = "eth_sign",
  EthSendtransaction = "eth_sendtransaction",
  EthAccounts = "eth_accounts",
}
