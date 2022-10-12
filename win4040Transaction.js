router.get("/:address/transactions", async function(req, res) {
    let acc = req.params.address
    let accountInfo = await client.lookupAccountTransactions(acc).do()

    const transactions = accountInfo.transactions.map(tx => {
        const transaction = {
            id: tx.id,
            fee: tx.fee,
            note: tx.note,
            from: tx.sender,
            type: tx['tx-type']
        }

        if (tx['tx-type'] === 'pay') {
            transaction.receiver = tx['payment-transaction'].receiver
            transaction.amount = tx['payment-transaction'].amount
        }

        return transaction
    })

    res.send(transactions)
});

router.get("/create", async function (req, res) {
    console.log('Creating new wallet')
    let walletid = (await kmdclient.createWallet("MyTestWallet", "testpassword", "", "sqlite")).wallet.id;
    console.log("Created wallet:", walletid);

    let wallethandle = (await kmdclient.initWalletHandle(walletid, "testpassword")).wallet_handle_token;
    console.log("Got wallet handle:", wallethandle);

    let address1 = (await kmdclient.generateKey(wallethandle)).address;
    console.log("Created new account:", address1);

  res.send('account')
});
