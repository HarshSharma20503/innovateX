# SupplyPoint
Platform for tokenizing supply chain assets and tracking their movement. Assets are stored as NFTs on `Diamante` blockchain.

## Features
- Tokenization of physical assets into NFTs
- Secure and transparent tracking of asset movement
- OTP and QR code verification for counterfeit prevention
- Real-time monitoring and reporting of supply chain activities

## Workflow
In our proposed solution, in order to make tracking of supply chain asset movement more transparent, counterfeit proof and safe, we have devised the following:
- 3 user roles: Seller, Middleman, Buyer
- When an order is placed, the seller adds the item information on the website, which then creates a NFT of that item along with unique identifiers such as `QR codes` and `RFID tags`
- Whenever the item is passed from one person to the other, the receiver generates an OTP and the person delivering has to verify it
- Along with OTP verification, the receiver scans and validates the QR code on the item in order to make the process counterfeit sage
- After each transit stage, the metadata of the NFT is updated in order to show realtime updates

![supply-point](https://github.com/user-attachments/assets/a4d6bc32-396b-4f4d-953e-b903d6d1187c)

## User Roles
- **Seller**: Adds items to the platform and creates NFTs.
- **Middleman**: Handles the transportation and transfer of items.
- **Buyer**: Receives the items and completes the transaction.

## Setup

- Frontend
```bash
# Install dependencies
cd frontend
npm i

# Copy and set environment variables
cp .env.dev .env
npm run dev
```

- Backend
```bash
cd backend
npm i

cp .env.dev .env
npm run dev
```

- Blockchain
```bash
cd blockchain
go get .

cp .env.dev .env
go run .
```