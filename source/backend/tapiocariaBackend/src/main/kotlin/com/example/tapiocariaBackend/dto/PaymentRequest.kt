package com.example.tapiocariaBackend.dto

data class PaymentRequest(
    val idFood: Int,
    val cpf: String,
    val saleDate: String,
    val description: String,
    val price: Float
)
