package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/create/{orderId}", createNFT)
	r.Post("/update/{orderId}", updateNFT)
	r.Get("/get/{orderHash}", getNFT)

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
