export enum Event {
  Request = "web3WalletRequest",
  Response = "web3WalletResponse",
  ResponseError = "web3WalletResponseError",
}

export enum BackgroundEvent {
  SetPrivateKey = "background.setPrivateKey",
  GetPrivateKey = "background.getPrivateKey",
}

export enum InternalRpcMethods {
  EthSign = "eth_sign",
  PersonalSign = "personal_sign",
  EthSignTransaction = "eth_signTransaction",
  EthSendtransaction = "eth_sendTransaction",
  EthAccounts = "eth_accounts",
}
