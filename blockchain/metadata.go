package main

import (
	"bytes"
	"encoding/json"
	"io"
	"os"

	"github.com/diamcircle/go/clients/auroraclient"
	"github.com/diamcircle/go/keypair"
	"github.com/diamcircle/go/network"
	"github.com/diamcircle/go/txnbuild"
	shell "github.com/ipfs/go-ipfs-api"
)

func uploadIPFS(metadata NFT) (string, error) {
	body, err := json.Marshal(metadata)
	if err != nil {
		return "", err
	}

	sh := shell.NewShell("https://uploadipfs.diamcircle.io")
	reader := bytes.NewReader(body)
	cid, err := sh.Add(reader)
	if err != nil {
		return "", err
	}
	return cid, nil
}

func readIPFS(cid string, nft *NFT) error {
	sh := shell.NewShell("https://uploadipfs.diamcircle.io")
	reader, err := sh.Cat(cid)
	if err != nil {
		return err
	}

	nftData, err := io.ReadAll(reader)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(nftData, nft); err != nil {
		return err
	}
	return nil
}

func UpdateOrder(orderId string, metadata NFT) (string, error) {
	client := auroraclient.DefaultTestNetClient
	distributorSeed := os.Getenv("DISTRIBUTOR_SEED")

	distributor, err := keypair.ParseFull(distributorSeed)
	if err != nil {
		return "", err
	}

	request := auroraclient.AccountRequest{AccountID: distributor.Address()}
	distributorAccount, err := client.AccountDetail(request)
	if err != nil {
		return "", err
	}

	// Upload NFT metadata to IPFS
	nftCid, err := uploadIPFS(metadata)
	if err != nil {
		return "", err
	}

	// Asset data contains orderId as key and cid as value
	txn, err := txnbuild.NewTransaction(
		txnbuild.TransactionParams{
			SourceAccount:        &distributorAccount,
			IncrementSequenceNum: true,
			BaseFee:              txnbuild.MinBaseFee,
			Timebounds:           txnbuild.NewInfiniteTimeout(),
			Operations: []txnbuild.Operation{
				&txnbuild.ManageData{
					Name:  orderId,
					Value: []byte(nftCid),
				},
			},
		},
	)
	if err != nil {
		return "", err
	}

	signedTxn, err := txn.Sign(network.TestNetworkPassphrase, distributor)
	if err != nil {
		return "", err
	}
	response, err := client.SubmitTransaction(signedTxn)
	if err != nil {
		return "", err
	}
	return response.Hash, nil
}

func GetOrder(orderHash string, nft *NFT) error {
	client := auroraclient.DefaultTestNetClient
	// Get data for transaction hash
	request := auroraclient.OperationRequest{ForTransaction: orderHash}
	operation, err := client.Operations(request)
	if err != nil {
		return err
	}

	jsonResponse, err := json.Marshal(operation.Embedded.Records[0])
	if err != nil {
		return err
	}

	metadata := Asset{}
	if err := json.Unmarshal(jsonResponse, &metadata); err != nil {
		return err
	}
	// Parse cid from asset data
	nftCid, err := metadata.DecodeValue()
	if err != nil {
		return err
	}
	if err := readIPFS(nftCid, nft); err != nil {
		return err
	}
	return nil
}
