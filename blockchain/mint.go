package main

import (
	"os"

	"github.com/diamcircle/go/clients/auroraclient"
	"github.com/diamcircle/go/keypair"
	"github.com/diamcircle/go/network"
	"github.com/diamcircle/go/txnbuild"
)

func MintNFT(orderId string) error {
	client := auroraclient.DefaultTestNetClient
	// Create and use user private key (seed) as distributorSeed
	issuerSeed := os.Getenv("ISSUER_SEED")
	distributorSeed := os.Getenv("DISTRIBUTOR_SEED")

	issuer, err := keypair.ParseFull(issuerSeed)
	if err != nil {
		return err
	}
	distributor, err := keypair.ParseFull(distributorSeed)
	if err != nil {
		return err
	}

	request := auroraclient.AccountRequest{AccountID: issuer.Address()}
	issuerAccount, err := client.AccountDetail(request)
	if err != nil {
		return err
	}

	request = auroraclient.AccountRequest{AccountID: distributor.Address()}
	distributorAccount, err := client.AccountDetail(request)
	if err != nil {
		return err
	}

	orderNFT := txnbuild.CreditAsset{Code: orderId, Issuer: issuer.Address()}

	// Receiving account must trust the asset from the issuer
	txn, err := txnbuild.NewTransaction(
		txnbuild.TransactionParams{
			SourceAccount:        &distributorAccount,
			IncrementSequenceNum: true,
			BaseFee:              txnbuild.MinBaseFee,
			Timebounds:           txnbuild.NewInfiniteTimeout(),
			Operations: []txnbuild.Operation{
				&txnbuild.ChangeTrust{
					Line:  orderNFT.MustToChangeTrustAsset(),
					Limit: "1",
				},
			},
		},
	)
	if err != nil {
		return err
	}

	signedTxn, err := txn.Sign(network.TestNetworkPassphrase, distributor)
	if err != nil {
		return err
	}
	_, err = client.SubmitTransaction(signedTxn)
	if err != nil {
		return err
	}

	// Issuing account actually sends a payment using the asset
	txn, err = txnbuild.NewTransaction(
		txnbuild.TransactionParams{
			SourceAccount:        &issuerAccount,
			IncrementSequenceNum: true,
			BaseFee:              txnbuild.MinBaseFee,
			Timebounds:           txnbuild.NewInfiniteTimeout(),
			Operations: []txnbuild.Operation{
				&txnbuild.Payment{
					Destination: distributor.Address(),
					Asset:       orderNFT,
					Amount:      "1",
				},
			},
		},
	)
	if err != nil {
		return err
	}

	signedTxn, err = txn.Sign(network.TestNetworkPassphrase, issuer)
	if err != nil {
		return err
	}
	_, err = client.SubmitTransaction(signedTxn)
	if err != nil {
		return err
	}
	return nil
}
