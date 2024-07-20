package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func createNFT(w http.ResponseWriter, r *http.Request) {
	orderId := chi.URLParam(r, "orderId")
	// Mint NFT
	if err := MintNFT(orderId); err != nil {
		w.WriteHeader(400)
		render.JSON(w, r, ResponseError{Details: "Unable to create and mint NFT", Error: err.Error()})
		return
	}
	// Add NFT metadata
	nft := NFT{}
	if err := json.NewDecoder(r.Body).Decode(&nft); err != nil {
		w.WriteHeader(400)
		render.JSON(w, r, ResponseError{Details: "Invalid NFT metadata", Error: err.Error()})
		return
	}

	txnHash, err := UpdateOrder(orderId, nft)
	if err != nil {
		w.WriteHeader(400)
		render.JSON(w, r, ResponseError{Details: "Unable to add NFT metadata", Error: err.Error()})
		return
	}

	w.WriteHeader(201)
	render.JSON(w, r, struct {
		TxnHash string `json:"txn_hash"`
	}{TxnHash: txnHash})
}

func updateNFT(w http.ResponseWriter, r *http.Request) {
	nft := NFT{}
	if err := json.NewDecoder(r.Body).Decode(&nft); err != nil {
		w.WriteHeader(400)
		render.JSON(w, r, ResponseError{Details: "Invalid NFT metadata", Error: err.Error()})
		return
	}

	orderId := chi.URLParam(r, "orderId")
	txnHash, err := UpdateOrder(orderId, nft)
	if err != nil {
		w.WriteHeader(400)
		render.JSON(w, r, ResponseError{Details: "Unable to add NFT metadata", Error: err.Error()})
		return
	}

	w.WriteHeader(200)
	render.JSON(w, r, struct {
		TxnHash string `json:"txn_hash"`
	}{TxnHash: txnHash})
}

func getNFT(w http.ResponseWriter, r *http.Request) {
	orderHash := chi.URLParam(r, "orderHash")
	nft := NFT{}
	if err := GetOrder(orderHash, &nft); err != nil {
		w.WriteHeader(400)
		render.JSON(w, r, ResponseError{Details: "Unable to fetch NFT metadata", Error: err.Error()})
		return
	}

	w.WriteHeader(200)
	render.JSON(w, r, nft)
}
