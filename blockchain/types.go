package main

import (
	"encoding/base64"
	"time"
)

type ResponseError struct {
	Details string `json:"details"`
	Error   string `json:"error"`
}

type Identifiers struct {
	RFID string `json:"rfid"`
	QR   string `json:"qr"`
}

type Ownership struct {
	CurrentOwner   string    `json:"current_owner"`
	PreviousOwners []string  `json:"previous_owners"`
	Location       string    `json:"location"`
	Timestamp      time.Time `json:"timestamp"`
}

type Data struct {
	Item        string `json:"item"`
	Seller      string `json:"seller"`
	Buyer       string `json:"buyer"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
}

type Status struct {
	Delivered bool `json:"delivered"`
	Paid      bool `json:"Paid"`
}

type Tracking struct {
	Latitude  string    `json:"latitude"`
	Longitude string    `json:"longitude"`
	Handler   string    `json:"handler"`
	Timestamp time.Time `json:"timestamp"`
}

type NFT struct {
	Identifiers `json:"identifiers"`
	Ownership   `json:"ownership"`
	Data        `json:"Data"`
	Status      `json:"delivered"`
	Tracking    []Tracking `json:"tracking"`
}

type Asset struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

func (a *Asset) DecodeValue() (string, error) {
	data, err := base64.StdEncoding.DecodeString(a.Value)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
