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

    if (typeof req.query.extended !== 'undefined' && account.assets.length > 0) {
        const assetsDetails = await Promise.all(account.assets.map(asset => client.lookupAssetByID(asset.id).do()))

        account.assets.map(asset => {
            const assetDetail = assetsDetails.find(assetDetail => asset.id === assetDetail.asset.index)

            asset.decimals = assetDetail.asset.params.decimals
            asset.name = assetDetail.asset.params.name || ''
            asset['unit-name'] = assetDetail.asset.params['unit-name'] || ''
            asset.url = assetDetail.asset.params.url
            return asset
        })
    }

    res.send(account)
});
