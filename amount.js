router.get("/:address", async function(req, res) {
    let acc = req.params.address
    let accountInfo = await client.lookupAccountByID(acc).do()

    const account = {
        address: req.params.address,
        amount: accountInfo.account.amount,
        algo: (accountInfo.account.amount / 1000000),
        assets: accountInfo.account.assets.map(asset => ({ id: asset['asset-id'], amount: asset.amount })),
        status: accountInfo.account.status
    }

    res.send(account)
});
